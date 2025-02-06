"use client";
import { ColorCache } from "@/lib/mapUtils/colorCache";
import { generateTerraDrawOptions } from "@/lib/mapUtils/terraDrawOptions";
import { CustomFeature, MapBounds, MapCenter } from "@/types/MapTypes";
import { useMap, Map, Source, Layer } from "@vis.gl/react-maplibre";
import { MaplibreTerradrawControl } from "@watergis/maplibre-gl-terradraw";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { GeoJSONStoreFeatures } from "terra-draw";

import "maplibre-gl/dist/maplibre-gl.css";

interface ZonesAgenteProps {
    zonasBDD: CustomFeature[];
}

export default function MapView({ zonasBDD }: Readonly<ZonesAgenteProps>) {
    const { mymap } = useMap();
    const [draw, setDraw] = useState<MaplibreTerradrawControl | null>(null);
    const colorCache = new ColorCache();
    const [loading, setLoading] = useState(true);
    const [styleLoading, setStyleLoading] = useState(true);
    const [zones, setZones] = useState<GeoJSONStoreFeatures[]>([]);  // Para almacenar las zonas con su label

    useEffect(() => {
        const fetchData = async () => {
            if (mymap && !styleLoading) {
                const terraDrawOptions = generateTerraDrawOptions(colorCache);
                const newDraw = new MaplibreTerradrawControl(terraDrawOptions);
                mymap.addControl(newDraw);
                setDraw(newDraw);

                document.querySelectorAll(".maplibregl-ctrl-group").forEach(ctrl => {
                    (ctrl as HTMLElement).style.visibility = "hidden";
                });

                const zonesToDraw = zonasBDD;
                const geoJSONZones: GeoJSONStoreFeatures[] = [];

                zonesToDraw.forEach(zone => {
                    // Crear zona con nombre y propiedades
                    const newZone = {
                        id: zone.id,
                        type: "Feature",
                        geometry: { type: "Polygon", coordinates: zone.geometry.coordinates },
                        properties: { 
                            mode: "polygon", 
                            color: zone.properties.color, 
                            name: zone.properties.name,  // Usamos el nombre aquí
                            zoneName: zone.properties.name  // Nombre para la etiqueta
                        },
                    } as GeoJSONStoreFeatures;

                    colorCache.saveDataToColorCache(`"${zone.id}"`, zone.properties.color);
                    geoJSONZones.push(newZone);
                    newDraw?.getTerraDrawInstance().addFeatures([newZone]);
                });

                // Establecer las zonas para usarlas en la capa de etiquetas
                setZones(geoJSONZones);
                setLoading(false);
            }
        };
        fetchData();
    }, [mymap,styleLoading]);

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex flex-col md:flex-row w-full h-full gap-2">
                <div className="w-full h-full flex flex-col md:flex-row gap-2">
                    <div className="w-full h-full relative rounded-lg">
                        {loading && (
                            <div className="absolute inset-0 bg-gray-500 bg-opacity-75 flex flex-row items-center justify-center z-10">
                                <ClipLoader
                                    loading
                                    size={50}
                                    speedMultiplier={1}
                                    color="#ffffff"
                                />
                            </div>
                        )}
                        <Map
                            id="mymap"
                            initialViewState={{
                                longitude: MapCenter.lng,
                                latitude: MapCenter.lat,
                                zoom: 11.5
                            }}
                            maxBounds={MapBounds}
                            style={{ width: "100%", height: "100%", borderRadius: "0.5rem" }}
                            mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
                            onLoad={() => setStyleLoading(false)}
                        >
                            <Source
                                id="terra-draw"
                                type="geojson"
                                data={{
                                    type: "FeatureCollection",
                                    features: draw?.getFeatures() || []
                                }}
                            />
                            {/* Capa de texto para mostrar las etiquetas */}
                            {zones.length > 0 && (
                                <Source
                                    id="zone-labels"
                                    type="geojson"
                                    data={{
                                        type: "FeatureCollection",
                                        features: zones
                                    }}
                                />
                            )}
                            <Layer
                                id="terra-draw-text"
                                type="symbol"
                                source="zone-labels"  // Usamos la fuente 'zone-labels'
                                layout={{
                                    "text-field": ["get", "zoneName"],  // Extraemos el nombre de la propiedad
                                    "text-size": 14,
                                    "text-anchor": "center",  // Alineación del texto
                                    "text-offset": [0, 0]  // Evitar desplazamiento
                                }}
                                paint={{
                                    "text-color": "#000000",  // Color del texto
                                    "text-halo-color": "#ffffff",  // Color del halo (fondo blanco)
                                    "text-halo-width": 2,  // Ancho del halo
                                }}
                            />
                        </Map>
                    </div>
                </div>
            </div>
        </div>
    );
}
