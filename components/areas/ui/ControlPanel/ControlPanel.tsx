import React, { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { MaplibreTerradrawControl } from "@watergis/maplibre-gl-terradraw";
import "@watergis/maplibre-gl-terradraw/dist/maplibre-gl-terradraw.css";
import { Sidebar, SidebarContent, SidebarHeader, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import ZoneList from "../ZoneList/ZoneList";
import { GeoJSONStoreFeatures } from "terra-draw";
import PanelHeader from "./PanelHeader";
import { AddZoneDialog } from "../Dialogs/NewZoneDialog";
import { CustomFeature, DrawingModes, FeatureId } from "@/types/MapTypes";
import { EditZoneDialog } from "../Dialogs/EditZoneDialog";
import { createNewZones } from "@/actions/zone-actions";
import { useToast } from "@/hooks/use-toast";
import { LoadSkeleton } from "@/components/areas/maps/map";
import { writeZoneInfoToLocalStorage, getZoneInfoFromLocalStorage, eraseZoneInfoFromLocalStorage } from "@/lib/mapUtils/localStorageUtils";
import { useZones } from "@/hooks/useZones";
import { ColorCache } from "@/lib/mapUtils/colorCache";
import { handleFinish } from "@/lib/mapUtils/terraDrawUtils";
import {type OnFinishContext} from "terra-draw"

interface MapControlPanelProps {
    draw: MaplibreTerradrawControl;
    colorCache: ColorCache;
}


export default function MapControlPanel({ draw, colorCache }: MapControlPanelProps) {
    const { isMobile, setOpenMobile } = useSidebar();
    const { toast } = useToast();
    const [mode, setMode] = useState<DrawingModes>(DrawingModes.SinSeleccionar); // Estado para el modo de dibujo
    const [newZoneDialogOpen, setNewZoneDialogOpen] = useState(false); // Estado para el dialogo de nueva zona
    const [editingZoneDialogOpen, setEditingZoneDialogOpen] = useState(false); // Estado para el dialogo de edición de zona
    const [loading, setLoading] = useState(true);
    const [transactionLoading, setTransactionLoading] = useState(false);
    const [editingZonesInfo, setEditingZonesInfo] = useState(false);
    const {
        zones,
        setZones,
        fetchZones,
        deleteZone,
        addNewZoneToMap
    } = useZones(draw, colorCache);


    useEffect(() => {
        const localStorageZones = getZoneInfoFromLocalStorage();
        if (localStorageZones !== null)
            deleteZone(localStorageZones);

        fetchZones().then(() => {
            setLoading(false);
        }).catch((error) => {
            throw new Error(error);
        });

        
        const terraDrawInstance = draw.getTerraDrawInstance();
        const callback = (id:FeatureId, context:OnFinishContext) => {
            const parseId = id as string;
            handleFinish(
                parseId,
                context,
                draw,
                addNewZoneToMap,
                setMode,
                isMobile,
                setOpenMobile,
                replaceZone
            );
        }

        draw.getTerraDrawInstance().on("finish", callback);

        return () => {
            terraDrawInstance.off("finish", callback);
        };
    }, [draw]);


    const replaceZone = (newFeature: CustomFeature) => {
        setZones((prevZones) => [...prevZones, newFeature as CustomFeature]);
    }

    function changeEditingState(state: boolean) {
        setEditingZonesInfo(state);

    }

    function changeNewZoneDialogState(state: boolean) {
        if (!state) {
            setRenderMode();
        }
        setNewZoneDialogOpen(state);
    }
    function onZoneEdit(zone: CustomFeature) {
        writeZoneInfoToLocalStorage(zone);
        setEditingZoneDialogOpen(true);

    }

    function onEditZoneDialogSubmit() {

        const terraDrawInstance = draw?.getTerraDrawInstance();
        const zoneLocalStorage: CustomFeature = getZoneInfoFromLocalStorage();

        colorCache.saveDataToColorCache(`"${zoneLocalStorage.id}"`, zoneLocalStorage.properties.color);

        if (zoneLocalStorage.id !== undefined) {
            terraDrawInstance?.removeFeatures([zoneLocalStorage.id]);
        }

        const newZone = {
            id: zoneLocalStorage.id,
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: zoneLocalStorage.geometry.coordinates
            },
            properties: {
                mode: "polygon",
            },
        } as GeoJSONStoreFeatures;

        terraDrawInstance?.addFeatures([newZone]);

        setZones((prevZones) => {
            const updatedZones = prevZones.map((zone: CustomFeature) => {
                if (zone.id === zoneLocalStorage.id) {
                    return zoneLocalStorage;
                }
                return zone;
            });
            return updatedZones;
        });

        setEditingZoneDialogOpen(false);

    }

    function setRenderMode() {
        const terraDrawInstance = draw?.getTerraDrawInstance();
        const zones = JSON.parse(window.localStorage.getItem("zones") || "[]");
        if (zones.length > 0) {
            eraseZoneInfoFromLocalStorage();
        }
        terraDrawInstance?.setMode("render");
        setMode(DrawingModes.SinSeleccionar);

    }

    function onNewZoneDialogSubmit() {
        if (isMobile) {
            setOpenMobile(false);
        }
        setNewZoneDialogOpen(false);
    }

    const addZone = () => {
        if (draw) {
            const terraDrawInstance = draw.getTerraDrawInstance();

            setNewZoneDialogOpen(true);
            terraDrawInstance?.setMode("polygon");
            setMode(DrawingModes.CreandoZonas);
        }
    };

    const editZone = () => {
        if (draw) {
            const terraDrawInstance = draw.getTerraDrawInstance();
            terraDrawInstance?.setMode("select");
            setMode(DrawingModes.EditandoZonas);

            if (isMobile) {
                setOpenMobile(false);
            }

        }
    };

    const discardZoneEdits = () => {
        if (draw) {
            const terraDrawInstance = draw.getTerraDrawInstance();
            zones.forEach((zone) => {
                if (zone.id) {
                    terraDrawInstance?.removeFeatures([zone.id]);
                }
            });

            zones.forEach((zone) => {
                addNewZoneToMap(zone);
            });


            terraDrawInstance?.setMode("render");
            setMode(DrawingModes.SinSeleccionar);

        }
    };

    const saveEdits = () => {
        if (draw) {
            const terraDrawInstance = draw.getTerraDrawInstance();
            terraDrawInstance?.setMode("render");

            draw.getFeatures()?.features.forEach((feature: GeoJSONStoreFeatures) => {
                const zone = zones.find((zone) => zone.id === feature.id);
                if (zone) {
                    zone.geometry.coordinates = feature.geometry.coordinates;
                }
                setZones([...zones]);
            });
            setMode(DrawingModes.SinSeleccionar);
        }
    };

    const saveChanges = async () => {
        // Verificar nombres duplicados
        setTransactionLoading(true);
        if (isMobile) {
            setOpenMobile(false);
        }

        const zoneNames = zones.map(zone => zone.properties.name);
        if (zoneNames.length !== new Set(zoneNames).size) {
            toast({
                title: "Error",
                description: "No pueden haber zonas con el mismo nombre, por favor cambie los nombres de las zonas repetidas",
                className: "bg-red-500 text-white",
                duration: 3000,
            });
            setTransactionLoading(false);
            if (isMobile) {
                setOpenMobile(true);
            }
            return;
        }

        changeEditingState(false);
        setMode(DrawingModes.SinSeleccionar);

        try {
            const response = await createNewZones(zones);
            setTransactionLoading(false);
            if (isMobile) {
                setOpenMobile(true);
            }
            if (response.status === "success") {
                toast({
                    title: "Zonas guardadas",
                    description: "Las zonas han sido guardadas exitosamente",
                    className: "bg-green-500 text-white",
                    duration: 2000,
                });
            } else {
                toast({
                    title: "Error",
                    description: response.message || "Ha ocurrido un error al guardar las zonas",
                    className: "bg-red-500 text-white",
                    duration: 2000,
                });
            }
        } catch (error) {
            setTransactionLoading(false);
            if (isMobile) {
                setOpenMobile(true);
            }
            const errorMessage =
                error instanceof Error
                    ? `Ha ocurrido un error al guardar las zonas: ${error.message}`
                    : "Ha ocurrido un error desconocido al guardar las zonas";

            toast({
                title: "Error",
                description: errorMessage,
                className: "bg-red-500 text-white",
                duration: 2000,
            });
        }
    };

    const discardChanges = async () => {

        setTransactionLoading(true);
        if (isMobile) {
            setOpenMobile(false);
        }


        if (draw) {
            const terraDrawInstance = draw.getTerraDrawInstance();
            terraDrawInstance?.setMode("render");

            zones.forEach((zone) => {
                if (zone.id) {
                    terraDrawInstance?.removeFeatures([zone.id]);
                    colorCache.deleteDataInColorCache(`"${zone.id}"`);
                }
            });
            setZones([]);
            fetchZones().then(() => {
                setMode(DrawingModes.SinSeleccionar);
                toast({
                    title: "Cambios descartados",
                    description: "Los cambios han sido descartados exitosamente",
                    className: "bg-green-500 text-white",
                    duration: 2000,
                });

                setTimeout(() => {

                }, 2000);
                changeEditingState(false);
                setTransactionLoading(false);
                if (isMobile) {
                    setOpenMobile(true);
                }

            }).catch((error) => {
                throw new Error(error);
            });

        }
        else {

            toast({
                title: "Error",
                description: "No se ha podido descartar los cambios",
                className: "bg-red-500 text-white",
                duration: 2000,
            });

            setTransactionLoading(false);
            if (isMobile) {
                setOpenMobile(true);
            }
            throw new Error("No se ha podido descartar los cambios");
        }


    }


    return (
        <div className="flex flex-row w-full h-full ">
            {loading ? (
                <LoadSkeleton />
            ) : (
                <div className="w-full h-full flex flex-row">
                    {
                        transactionLoading && (
                            <LoadSkeleton />
                        )
                    }
                    <Sidebar >
                        <SidebarHeader>
                            <PanelHeader onEdit={editZone} addZone={addZone} mode={mode} saveZoneEdits={saveEdits} discardZoneEdits={discardZoneEdits} saveChanges={saveChanges} discardChanges={discardChanges} editing={editingZonesInfo} setRenderMode={setRenderMode} setEditing={changeEditingState} />
                            <AddZoneDialog open={newZoneDialogOpen} setOpen={changeNewZoneDialogState} onDialogSubmit={onNewZoneDialogSubmit} />
                            <EditZoneDialog open={editingZoneDialogOpen} setOpen={setEditingZoneDialogOpen} onDialogSubmit={onEditZoneDialogSubmit} />
                        </SidebarHeader>

                        <Separator className="mb-5" />

                        <SidebarContent className="flex flex-col gap-5 items-center w-full  ">
                            <ZoneList zones={zones} onDelete={deleteZone} editing={editingZonesInfo} onEdit={onZoneEdit} />
                        </SidebarContent>
                    </Sidebar>

                    <SidebarTrigger className="flex items-center justify-center h-full " />
                </div>
            )

            }

        </div>
    );
}
