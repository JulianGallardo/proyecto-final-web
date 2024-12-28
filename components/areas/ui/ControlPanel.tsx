import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MaplibreTerradrawControl } from "@watergis/maplibre-gl-terradraw";
import "@watergis/maplibre-gl-terradraw/dist/maplibre-gl-terradraw.css";
import { useMap } from "@vis.gl/react-maplibre";
import ZoneCard from "./ZoneCard";

/** Utilidades generales **/
function getFeatureById(draw: MaplibreTerradrawControl, id: string) {
    return draw.getFeatures()?.features?.find((feature: any) => feature.id === id);
}

function getRandomColor() {
    return Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}

export default function Sidebar() {
    const { mymap } = useMap();
    const [zones, setZones] = useState<GeoJSON.Feature[]>([]); // Estado de zonas
    const [draw, setDraw] = useState<MaplibreTerradrawControl | null>(null); // Estado para el controlador

    // Inicializar TerraDraw
    useEffect(() => {
        if (mymap && !draw) {
            const newDraw = new MaplibreTerradrawControl({
                modes: [
                    "render",
                    "polygon",
                    "select",
                    "delete-selection",
                    "delete",
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
                    const color = `#${getRandomColor()}`;
                    const Feature = getFeatureById(draw, e);

                    if (Feature) {
                        Feature.properties = { ...Feature.properties, color };
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
            const color = `#${getRandomColor()}`;
            const terraDrawInstance = draw.getTerraDrawInstance();

            terraDrawInstance?.setModeStyles("polygon", {
                fillColor: color,
                outlineColor: color,
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
        <div className="flex flex-col w-1/4 h-full bg-gray-100 shadow-lg p-5">
            {/* Encabezado */}
            <div className="mb-5">
                <h1 className="text-2xl font-bold text-gray-800">Controles</h1>
            </div>

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

            {/* Separador */}
            <Separator className="mb-5" />

            {/* Listado de Zonas */}
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Zonas</h2>
                <div className="flex flex-col flex-grow gap-2">
                    {zones.map((zone) => (
                        <ZoneCard
                            key={zone.id as string}
                            zoneName={zone.properties?.name || "Zona"}
                            Feature={zone}
                            onEdit={editZone}
                            onDelete={() => deleteZone(zone)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
