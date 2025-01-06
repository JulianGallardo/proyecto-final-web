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
import { LoadSkeleton } from "@/components/areas/maps/map";
import { writeZoneInfoToLocalStorage, getZoneInfoFromLocalStorage } from "@/lib/mapUtils/localStorageUtils";
import { useZones } from "@/hooks/useZones";
import { ColorCache } from "@/lib/mapUtils/colorCache";
import { handleFinish } from "@/lib/mapUtils/terraDrawUtils";
import { type OnFinishContext } from "terra-draw"
import { addZoneHelper, discardChangesHelper, discardZoneEditsHelper, editZoneHelper, saveChangesHelper, saveEditsHelper, setRenderModeHelper } from "@/lib/mapUtils/panelControlUtils";

interface MapControlPanelProps {
    draw: MaplibreTerradrawControl;
    colorCache: ColorCache;
}


export default function MapControlPanel({ draw, colorCache }: Readonly<MapControlPanelProps>) {
    const { isMobile, setOpenMobile } = useSidebar();
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
        const callback = (id: FeatureId, context: OnFinishContext) => {
            const parseId = id as string;
            handleFinish(
                parseId,
                context,
                draw,
                addNewZoneToMap,
                setMode,
                replaceZone
            );
            if (isMobile) {
                setOpenMobile(true);
            }
        }

        draw.getTerraDrawInstance().on("finish", callback);

        return () => {
            terraDrawInstance.off("finish", callback);
        };
    }, [draw]);


    const replaceZone = (newFeature: CustomFeature) => {
        setZones((prevZones) => [...prevZones, newFeature]);
    }

    function changeEditingState(state: boolean) {
        setEditingZonesInfo(state);

    }

    function changeNewZoneDialogState(state: boolean) {
        if (!state) {
            setRenderModeHelper(
                draw,
                setMode
            );
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

    function onNewZoneDialogSubmit() {
        if (isMobile) {
            setOpenMobile(false);
        }
        setNewZoneDialogOpen(false);
    }


    function discardChanges() {
        setTransactionLoading(true);
        if (isMobile) {
            setOpenMobile(false);
        }

        discardChangesHelper(
            zones,
            draw,
            colorCache,
            setZones,
            setMode,
            changeEditingState,
            fetchZones
        ).then(() => {
            setTransactionLoading(false);
            if (isMobile) {
                setOpenMobile(true);
            }
        }).catch((error) => {
            throw new Error(error);
        });
    }


    function addZone(): void {
        addZoneHelper(
            draw,
            setNewZoneDialogOpen,
            setMode,
        );
    }

    function saveEdits(): void {
        saveEditsHelper(
            draw,
            zones,
            setZones,
            setMode,
        );
    }

    function discardZoneEdits(): void {
        discardZoneEditsHelper(
            draw,
            zones,
            setMode,
            addNewZoneToMap
        );
    }

    function saveChanges(): void {
        saveChangesHelper(
            setTransactionLoading,
            isMobile,
            setOpenMobile,
            zones,
            changeEditingState,
            setMode
        );
    }

    function editZone() {
        editZoneHelper(
            draw,
            setMode,
            isMobile,
            setOpenMobile
        );
    }

    function setRenderMode() {
        setRenderModeHelper(
            draw,
            setMode
        );
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
