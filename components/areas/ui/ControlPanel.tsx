import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MaplibreTerradrawControl } from "@watergis/maplibre-gl-terradraw";
import "@watergis/maplibre-gl-terradraw/dist/maplibre-gl-terradraw.css";
import { useMap } from "@vis.gl/react-maplibre";
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import ZoneList from "./ZoneList";
import { TerraDrawPolygonMode, TerraDrawSelectMode } from "terra-draw";


type HexColorStyling = `#${string}`;

function getFeatureById(draw: MaplibreTerradrawControl, id: string) {
    return draw.getFeatures()?.features?.find((feature: any) => feature.id === id);
}


export default function MapControlPanel() {
    const colorCache: Record<string, HexColorStyling> = {};

    const { mymap } = useMap();
    const [zones, setZones] = useState<GeoJSON.Feature[]>([]); // Estado de zonas
    const [draw, setDraw] = useState<MaplibreTerradrawControl | null>(null); // Estado para el controlador



    function computeColor(key: string): HexColorStyling {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = key.charCodeAt(i) + ((hash << 5) - hash);
        }
        const color = `#${((hash >> 24) & 0xFF).toString(16).padStart(2, '0')}${((hash >> 16) & 0xFF).toString(16).padStart(2, '0')}${((hash >> 8) & 0xFF).toString(16).padStart(2, '0')}` as HexColorStyling;
        return color;
    }

    // Function to get a color, using the cache
    function getColor(key: string): HexColorStyling  {
        // Check if the color is already in the cache
        if (colorCache[key]) {
            return colorCache[key];
        }

        // If not in the cache, compute the color
        const color = computeColor(key);

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
                                        deletable: false
                                    }
                                }

                            }
                        }
                    }),
                    polygon: new TerraDrawPolygonMode({
                        styles: {
                            fillColor: ({ id }) => {
                                return getColor(`"${id}"`);
                            },
                            outlineColor: ({ id }) => {
                                return getColor(`"${id}"`);
                            },
                        }
                        
                    }),
                }
            });
        


            mymap.addControl(newDraw); // Agregar el control al mapa
            setDraw(newDraw); // Guardar el controlador en el estado
        }
    }, [mymap, draw]);

    // Manejar el evento "finish"
    useEffect(() => {
        if (draw) {
            const terraDrawInstance = draw.getTerraDrawInstance();

            if (terraDrawInstance) {
                const handleFinish = (id:any, context: { action: string, mode: string }) => {
                    const parsedId = id as string;
                    const Feature = getFeatureById(draw, parsedId);
                    const {action,mode} = context;

                    if(action === "draw" && mode === "polygon"){
                        if (Feature) {
                            if (Feature.id) {
                                Feature.properties.color = getColor(`"${Feature.id}"`);
                            }
    
                            setZones((prevZones) => [...prevZones, Feature]);
    
                            terraDrawInstance.setMode("render");
                        }
                    }

                    else if(action === "draw" && mode === "select") {
                        if (Feature) {
                            setZones((prevZones) => {
                                const updatedZones = prevZones.map((zone) => {
                                    if (zone.id === Feature.id) {
                                        return Feature;
                                    }
                                    return zone;
                                });
                                return updatedZones;
                            });
                        }
                    }  
                };

                terraDrawInstance.on("finish",(id,context) => handleFinish(id,context));
                
                


                return () => {
                    terraDrawInstance.off("finish", handleFinish);
                };
            }
        }
    }, [draw]);

    /** Funciones de manejo de zonas **/
    const addZone = () => {
        if (draw) {
            const terraDrawInstance = draw.getTerraDrawInstance();
            terraDrawInstance?.setMode("polygon");

        }
    };

    const deleteZone = useCallback(
        (featureToDelete: GeoJSON.Feature) => {
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

    const editZone = (feautreToEdit: GeoJSON.Feature) => {
        if (draw) {
            const terraDrawInstance = draw.getTerraDrawInstance();

            if(feautreToEdit.id === undefined){
                throw new Error("Feature ID is undefined");
            }
            
            terraDrawInstance?.selectFeature(feautreToEdit.id);

            

        }
    };

    return (
        <Sidebar >
            <SidebarHeader>
                <div className="flex flex-col gap-4 mb-5">
                    <Button onClick={addZone} className="w-full" variant="default">
                        Agregar Zona
                    </Button>
                    <Button className="w-full" variant="secondary">
                        Calcular Zona
                    </Button>
                </div>
            </SidebarHeader>

            <Separator className="mb-5" />

            <SidebarContent className="flex flex-col gap-5 items-center w-full  ">
                <ZoneList zones={zones} onEdit={editZone} onDelete={deleteZone} />
            </SidebarContent>
        </Sidebar>
    );
}
