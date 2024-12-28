// App.jsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MaplibreTerradrawControl } from '@watergis/maplibre-gl-terradraw'
import '@watergis/maplibre-gl-terradraw/dist/maplibre-gl-terradraw.css'
import { useMap } from "@vis.gl/react-maplibre";
import { Feature } from "maplibre-gl";
import ZoneCard from "./ZoneCard";


export default function Sidebar() {

    const { mymap } = useMap();
    const draw: MaplibreTerradrawControl = new MaplibreTerradrawControl({
        modes: ['render', 'point', 'linestring', 'polygon', 'rectangle', 'circle', 'freehand', 'angled-rectangle', 'sensor', 'sector', 'select', 'delete-selection', 'delete', 'download'],
    });
    const [zones, setZones] = useState<GeoJSON.Feature[]>([]);

    useEffect(() => {
        console.log(mymap);
        if (!mymap) return;
        mymap.addControl(draw);

    }, [mymap]);


    function addZone(draw: MaplibreTerradrawControl) {
        draw.getTerraDrawInstance().setMode('polygon');
        draw.getTerraDrawInstance().on('finish', (e: any) => {
            const Feature = getFeatureById(draw, e);
            if (Feature) {
                setZones([...zones, Feature]);
            }
        });
    }

    function editZone(draw: MaplibreTerradrawControl) {
        console.log(draw.getFeatures());

    }

    function deleteZone(draw: MaplibreTerradrawControl, featureToDelete: GeoJSON.Feature) {
        const features = draw.getFeatures();
        const zones = features.features.filter((feature: any) => feature.id !== featureToDelete.id);

        if (featureToDelete.id !== undefined) {
            draw.getTerraDrawInstance().removeFeatures([featureToDelete.id]);
        }

        setZones(zones);
    }



    function getFeatureById(draw: MaplibreTerradrawControl, id: string) {
        const features = draw.getFeatures();
        const feature = features.features.find((feature: any) => feature.id === id);
        return feature;
    }






    return (
        <div className="flex flex-col w-1/4 h-full bg-gray-100 shadow-lg p-5">
            {/* Encabezado */}
            <div className="mb-5">
                <h1 className="text-2xl font-bold text-gray-800">Controles</h1>
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-col gap-4 mb-5">
                <Button onClick={() => addZone(draw)} className="w-full" variant="default">
                    Agregar Zona
                </Button>
                <Button onClick={() => editZone(draw)} className="w-full" variant="secondary">
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
                    {zones.map((zone, index) => (
                        <ZoneCard
                            key={index}
                            zoneName={zone.properties?.name || 'Zona'}
                            Feature={zone}
                            onEdit={() => editZone(draw)}
                            onDelete={() => deleteZone(draw, zone)} 
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
