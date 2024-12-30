import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MaplibreTerradrawControl } from "@watergis/maplibre-gl-terradraw";
import "@watergis/maplibre-gl-terradraw/dist/maplibre-gl-terradraw.css";
import { useMap } from "@vis.gl/react-maplibre";
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import ZoneList from "./ZoneList";

/** Utilidades generales **/
function getFeatureById(draw: MaplibreTerradrawControl, id: string) {
    return draw.getFeatures()?.features?.find((feature: any) => feature.id === id);
}

function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


export default function MapControlPanel() {
    const colorCache: Record<string, string> = {};

    const { mymap } = useMap();
    const [zones, setZones] = useState<GeoJSON.Feature[]>([]); // Estado de zonas
    const [draw, setDraw] = useState<MaplibreTerradrawControl | null>(null); // Estado para el controlador



    // Function to compute a new color based on a key
    function computeColor(key: string): string {
        // Simple example: generate a color based on the key's hash code
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = key.charCodeAt(i) + ((hash << 5) - hash);
        }
        const color = `#${((hash >> 24) & 0xFF).toString(16).padStart(2, '0')}${((hash >> 16) & 0xFF).toString(16).padStart(2, '0')}${((hash >> 8) & 0xFF).toString(16).padStart(2, '0')}`;
        return color;
    }

    // Function to get a color, using the cache
    function getColor(key: string): string {
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
                const handleFinish = (e: any) => {
                    const Feature = getFeatureById(draw, e);
                    if (Feature) {
                        if (Feature.id) {
                            Feature.properties.color = getColor(`"${Feature.id}"`);
                        }

                        setZones((prevZones) => [...prevZones, Feature]);

                        terraDrawInstance.setMode("render");
                    }
                };

                terraDrawInstance.on("finish", handleFinish);

                // Cleanup del evento al desmontar
                return () => {
                    terraDrawInstance.off("finish", handleFinish);
                };
            }
        }
    }, [draw]);

    /** Funciones de manejo de zonas **/
    const addZone = useCallback(() => {
        if (draw) {
            const terraDrawInstance = draw.getTerraDrawInstance();

            terraDrawInstance?.setModeStyles("polygon", {
                fillColor: ({ id }) => {
                    return getColor(`"${id}"`);
                },
                outlineColor: ({ id }) => {
                    return getColor(`"${id}"`);
                },

            });

            terraDrawInstance?.setMode("polygon");

        }
    }, [draw]);

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

    const editZone = useCallback(() => {
        draw?.getTerraDrawInstance()?.setMode("select");
    }, [draw]);

    return (
        <Sidebar >
            <SidebarHeader className=" ">
                {/* Botones de Acción */}
                <div className="flex flex-col gap-4 mb-5">
                    <Button onClick={addZone} className="w-full" variant="default">
                        Agregar Zona
                    </Button>
                    <Button onClick={editZone} className="w-full" variant="secondary">
                        Desplazar
                    </Button>
                    <Button className="w-full" variant="secondary">
                        Calcular Zona
                    </Button>
                </div>
            </SidebarHeader>

            {/* Separador */}
            <Separator className="mb-5" />

            {/* Listado de Zonas */}
            <SidebarContent className="flex flex-col gap-5 items-center w-full  ">
                <ZoneList zones={zones} onEdit={editZone} onDelete={deleteZone} />
            </SidebarContent>
        </Sidebar>
    );
}
