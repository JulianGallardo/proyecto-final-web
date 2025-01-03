import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { MaplibreTerradrawControl } from "@watergis/maplibre-gl-terradraw";
import "@watergis/maplibre-gl-terradraw/dist/maplibre-gl-terradraw.css";
import { useMap } from "@vis.gl/react-maplibre";
import { Sidebar, SidebarContent, SidebarHeader, SidebarTrigger } from "@/components/ui/sidebar";
import ZoneList from "../ZoneList/ZoneList";
import { GeoJSONStoreFeatures, TerraDrawPolygonMode, TerraDrawSelectMode } from "terra-draw";
import PanelHeader from "./PanelHeader";
import { AddZoneDialog } from "../Dialogs/NewZoneDialog";
import { CustomFeature, DrawingModes, FeatureId, HexColorStyling } from "@/types/MapTypes";
import { EditZoneDialog } from "../Dialogs/EditZoneDialog";
import { createNewZones, getAllZones } from "@/actions/zone-actions";
import { useToast } from "@/hooks/use-toast";
import { LoadSkeleton } from "@/components/areas/maps/map";
import { z } from "zod";




function getFeatureById(draw: MaplibreTerradrawControl, id: string) {
    return draw.getFeatures()?.features?.find((feature: GeoJSON.Feature) => feature.id === id);
}



export default function MapControlPanel() {
    const colorCache = useMemo(() => new Map<string, HexColorStyling>(), []); // Cache de colores
    const { mymap } = useMap();
    const { toast } = useToast();

    const [zones, setZones] = useState<CustomFeature[]>([]); // Estado de zonas
    const [draw, setDraw] = useState<MaplibreTerradrawControl | null>(null); // Estado para el controlador
    const [mode, setMode] = useState<DrawingModes>(DrawingModes.SinSeleccionar); // Estado para el modo de dibujo

    const [newZoneDialogOpen, setNewZoneDialogOpen] = useState(false); // Estado para el dialogo de nueva zona
    const [editingZoneDialogOpen, setEditingZoneDialogOpen] = useState(false); // Estado para el dialogo de edición de zona


    const [loading, setLoading] = useState(true);
    const [transactionLoading, setTransactionLoading] = useState(false);
    const [editingZonesInfo, setEditingZonesInfo] = useState(false);




    function fetchDataFromColorCache(key: string) {
        if (colorCache.has(key)) {
            return colorCache.get(key);
        }
        return null;
    }

    function saveDataToColorCache(key: string, value: HexColorStyling) {
        colorCache.set(key, value);
    }

    function deleteDataInColorCache(key: string) {
        colorCache.delete(key);
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

        saveDataToColorCache(`"${zoneLocalStorage.id}"`, zoneLocalStorage.properties.color);

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
        setNewZoneDialogOpen(false);
    }




    function getZoneInfoFromLocalStorage() {
        const zones = JSON.parse(window.localStorage.getItem("zones") || "[]");
        if (zones.length > 0) {
            eraseZoneInfoFromLocalStorage();
            return zones[0];
        }
        else {
            return null;
        }
    }

    function eraseZoneInfoFromLocalStorage() {
        window.localStorage.removeItem("zones");
    }

    function writeZoneInfoToLocalStorage(zoneInfo: CustomFeature) {
        window.localStorage.setItem("zones", JSON.stringify([zoneInfo]));
    }

    function getZoneColorFromLocalStorage() {
        const zones = JSON.parse(window.localStorage.getItem("zones") || "[]");
        if (zones.length > 0) {
            return zones[0].color;
        }
        else {
            return null;
        }
    }

    function getColor(key: string): HexColorStyling {
        const get = fetchDataFromColorCache(key);
        if (get) {
            return get;
        }

        const color = getZoneColorFromLocalStorage();

        saveDataToColorCache(key, color);
        return color;
    }



    // Inicializar TerraDraw
    useEffect(() => {
        if (mymap && !draw) {
            const newDraw = new MaplibreTerradrawControl({
                modes: [
                    "render",
                    "polygon",
                    "select",
                    "download",
                ],
                modeOptions: {
                    select: new TerraDrawSelectMode({
                        allowManualDeselection: false,

                        flags: {
                            polygon: {

                                feature: {
                                    draggable: false,
                                    rotateable: false,
                                    scaleable: true,
                                    coordinates: {
                                        midpoints: true,
                                        draggable: true,
                                        deletable: true,
                                    },
                                    selfIntersectable: false,
                                }

                            }
                        },

                    }),
                    polygon: new TerraDrawPolygonMode({
                        styles: {
                            fillColor: ({ id }) => {
                                return getColor(`"${id}"`);
                            },
                            outlineColor: ({ id }) => {
                                return getColor(`"${id}"`);
                            },
                        },


                    }),
                }
            });



            mymap.addControl(newDraw); // Agregar el control al mapa
            setDraw(newDraw); // Guardar el controlador en el estado
            deleteZone(getZoneInfoFromLocalStorage());

            fetchZones(newDraw).then(() => {
                setLoading(false);
            }).catch((error) => {
                throw new Error(error);
            });
        }
    }, [mymap, draw]);






    // Manejar el evento "finish"
    useEffect(() => {
        if (draw) {
            const terraDrawInstance = draw.getTerraDrawInstance();

            if (terraDrawInstance) {
                const handleFinish = (id: FeatureId, context: { action: string, mode: string }) => {
                    const parsedId = id as string;
                    const Feature = getFeatureById(draw, parsedId);
                    const { action, mode } = context;




                    if (action === "draw" && mode === "polygon") {
                        if (Feature) {
                            if (Feature.id) {
                                const newZoneInfo = getZoneInfoFromLocalStorage();




                                Feature.properties.color = newZoneInfo.color;
                                Feature.properties.editable = false;
                                Feature.properties.name = newZoneInfo.name;
                            }

                            if (Feature && Feature.id) {
                                setZones((prevZones) => [...prevZones, Feature as CustomFeature]);
                            }
                            terraDrawInstance.setMode("render");
                            setMode(DrawingModes.SinSeleccionar);
                        }
                    }





                    else if (action === "dragCoordinate" && mode === "select") {
                        if (Feature) {
                            setZones((prevZones) => {
                                const updatedZones = prevZones.map((zone) => {
                                    if (zone.id === Feature.id) {
                                        return Feature as CustomFeature;
                                    }
                                    return zone;
                                });
                                return updatedZones;
                            });
                        }
                    }


                };

                terraDrawInstance.on("finish", (id, context) => {


                    const parseId = id as string;
                    handleFinish(parseId, context);

                });



            }
        }
    }, [draw]);


    async function fetchZones(terraDrawInstance: MaplibreTerradrawControl) {
        const zones = await getAllZones();
        const terraDraw = terraDrawInstance.getTerraDrawInstance();
        zones.forEach((zone) => {
            const newZone = {
                id: zone.id,
                type: "Feature",
                geometry: {
                    type: "Polygon",
                    coordinates: zone.geometry.coordinates
                },
                properties: {
                    mode: "polygon",
                    color: zone.properties.color,
                    name: zone.properties.name
                },
            } as GeoJSONStoreFeatures;

            saveDataToColorCache(`"${zone.id}"`, zone.properties.color);
            terraDraw?.addFeatures([newZone]);

        });
        setZones(zones);
    }


    /** Funciones de manejo de zonas **/
    const addZone = () => {
        if (draw) {
            const terraDrawInstance = draw.getTerraDrawInstance();

            setNewZoneDialogOpen(true);
            terraDrawInstance?.setMode("polygon");
            setMode(DrawingModes.CreandoZonas);

        }
    };

    const deleteZone = useCallback(
        (featureToDelete: CustomFeature) => {
            if (draw) {
                const updatedZones = zones.filter((zone) => zone.id !== featureToDelete.id);
                setZones(updatedZones);

                if (featureToDelete.id) {
                    draw.getTerraDrawInstance()?.removeFeatures([featureToDelete.id]);
                    deleteDataInColorCache(`"${featureToDelete.id}"`);
                }
            }
        },
        [zones, draw]
    );



    const editZone = () => {
        if (draw) {
            const terraDrawInstance = draw.getTerraDrawInstance();
            terraDrawInstance?.setMode("select");
            setMode(DrawingModes.EditandoZonas);
        }
    };

    const saveEdits = () => {
        if (draw) {
            const terraDrawInstance = draw.getTerraDrawInstance();
            terraDrawInstance?.setMode("render");
            setMode(DrawingModes.SinSeleccionar);
        }
    };

    const saveChanges = async () => {
        // Verificar nombres duplicados
        setTransactionLoading(true);
        const zoneNames = zones.map(zone => zone.properties.name);
        if (zoneNames.length !== new Set(zoneNames).size) {
            toast({
                title: "Error",
                description: "No pueden haber zonas con el mismo nombre, por favor cambie los nombres de las zonas repetidas",
                className: "bg-red-500 text-white",
                duration: 3000,
            });
            return;
        }

        changeEditingState(false);
        setMode(DrawingModes.SinSeleccionar);

        try {
            const response = await createNewZones(zones);
            setTransactionLoading(false);
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

        if (draw) {
            const terraDrawInstance = draw.getTerraDrawInstance();
            terraDrawInstance?.setMode("render");
            
            zones.forEach((zone) => {
                if (zone.id) {
                    terraDrawInstance?.removeFeatures([zone.id]);
                    deleteDataInColorCache(`"${zone.id}"`);
                }
            });            
            setZones([]);
            fetchZones(draw).then(() => {
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
                            <PanelHeader onEdit={editZone} addZone={addZone} mode={mode} saveZoneEdits={saveEdits} saveChanges={saveChanges} discardChanges={discardChanges} editing={editingZonesInfo} setRenderMode={setRenderMode} setEditing={changeEditingState} />
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
