import React, { useState, useEffect, useCallback } from "react";
import { Separator } from "@/components/ui/separator";
import { MaplibreTerradrawControl } from "@watergis/maplibre-gl-terradraw";
import "@watergis/maplibre-gl-terradraw/dist/maplibre-gl-terradraw.css";
import { useMap } from "@vis.gl/react-maplibre";
import { Sidebar, SidebarContent, SidebarHeader, SidebarTrigger } from "@/components/ui/sidebar";
import ZoneList from "./ZoneList";
import { TerraDrawPolygonMode, TerraDrawSelectMode } from "terra-draw";
import PanelHeader from "./PanelHeader";
import { AddZoneDialog } from "./NewZoneDialog";
import { boolean } from "zod";


type HexColorStyling = `#${string}`;
type FeatureId = string;

export interface CustomFeature extends GeoJSON.Feature {
    id: string;
    properties: {
        color: HexColorStyling;
        name: string;
    };
}

function getFeatureById(draw: MaplibreTerradrawControl, id: string) {
    return draw.getFeatures()?.features?.find((feature: GeoJSON.Feature) => feature.id === id);
}
type DrawingModes = "Sin seleccionar" | "Dibujando zona" | "Editando Zonas";



export default function MapControlPanel() {
    const colorCache: Record<string, HexColorStyling> = {};
    const { mymap } = useMap();
    const [zones, setZones] = useState<CustomFeature[]>([]); // Estado de zonas
    const [draw, setDraw] = useState<MaplibreTerradrawControl | null>(null); // Estado para el controlador
    const [mode, setMode] = useState<DrawingModes>("Sin seleccionar"); // Estado para el modo de dibujo
    const [newZoneDialogOpen, setNewZoneDialogOpen] = useState(false); // Estado para el dialogo de nueva zona
    const [finishedLoading, setFinishedLoading] = useState(false);
    const [editingZonesInfo, setEditingZonesInfo] = useState(false);

    function changeEditingState(state:boolean) {
        setEditingZonesInfo(state);
    }

    function changeDialogState(state:boolean) {
        if (!state){
            const terraDrawInstance = draw?.getTerraDrawInstance();
            terraDrawInstance?.setMode("render");
            setMode("Sin seleccionar");
        }
        setNewZoneDialogOpen(state);
    }

    function onDialogSubmit(){
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

    function getZoneColorFromLocalStorage() {
        const zones = JSON.parse(window.localStorage.getItem("zones") || "[]");
        if (zones.length > 0) {
            return zones[0].color;
        }
        else {
            return null;
        }
    }

    // Function to get a color, using the cache
    function getColor(key: string): HexColorStyling {
        // Check if the color is already in the cache
        if (colorCache[key]) {
            return colorCache[key];
        }

        // If not in the cache, compute the color
        const color = getZoneColorFromLocalStorage();

        // Store the computed color in the cache
        colorCache[key] = color;

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
            setFinishedLoading(true);
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

                                console.log(Feature);

                            }

                            if (Feature && Feature.id) {
                                setZones((prevZones) => [...prevZones, Feature as CustomFeature]);
                            }

                            terraDrawInstance.setMode("render");
                            setMode("Sin seleccionar");
                        }
                    }

                    else if (action === "draw" && mode === "select") {
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

    /** Funciones de manejo de zonas **/
    const addZone = () => {
        if (draw) {
            const terraDrawInstance = draw.getTerraDrawInstance();

            setNewZoneDialogOpen(true);
            terraDrawInstance?.setMode("polygon");
            setMode("Dibujando zona");

        }
    };

    const cancelAddZone = () => {
        if (draw) {
            const terraDrawInstance = draw.getTerraDrawInstance();
            terraDrawInstance?.setMode("render");
            setMode("Sin seleccionar");
        }
    }

    const deleteZone = useCallback(
        (featureToDelete: CustomFeature) => {
            if (draw) {
                const updatedZones = zones.filter((zone) => zone.id !== featureToDelete.id);
                setZones(updatedZones);

                if (featureToDelete.id) {
                    draw.getTerraDrawInstance()?.removeFeatures([featureToDelete.id]);
                }
            }
        },
        [zones, draw]
    );

    const editZone = () => {
        if (draw) {
            const terraDrawInstance = draw.getTerraDrawInstance();
            terraDrawInstance?.setMode("select");
            setMode("Editando Zonas");
        }
    };

    const saveEdits = () => {
        if (draw) {
            const terraDrawInstance = draw.getTerraDrawInstance();
            terraDrawInstance?.setMode("render");
            setMode("Sin seleccionar");
        }
    };

    const saveChanges = () => {
        changeEditingState(false);
        setMode("Sin seleccionar");
    }

    return (
        mymap && draw && finishedLoading &&
        <div className="flex flex-row w-full h-full ">
            <Sidebar >
                <SidebarHeader>
                    <PanelHeader onEdit={editZone} addZone={addZone} mode={mode} saveZoneEdits={saveEdits} saveChanges={saveChanges} editing={editingZonesInfo}  setEditing={changeEditingState}/>
                    <AddZoneDialog open={newZoneDialogOpen} setOpen={changeDialogState} onDialogSubmit={onDialogSubmit}/>
                </SidebarHeader>

                <Separator className="mb-5" />

                <SidebarContent className="flex flex-col gap-5 items-center w-full  ">
                    <ZoneList zones={zones} onDelete={deleteZone} />
                </SidebarContent>
            </Sidebar>

            <SidebarTrigger className="flex items-center justify-center h-full " />
        </div>
    );
}
