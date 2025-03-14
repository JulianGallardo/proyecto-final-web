"use client";
import { useMemo, useState } from "react";
import { Map, Source, Layer } from "@vis.gl/react-maplibre";
import { MapBounds, MapCenter } from "@/types/MapTypes";
import { ZoneDtoWithSubZones } from "@/types/ZoneTypes";
import { AgenteExtendidoDto } from "@/types/agenteTypes";
import "maplibre-gl/dist/maplibre-gl.css";
import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";

interface ZonesAgenteProps {
    zonasBDD: ZoneDtoWithSubZones[];
}

export default function SubZonesEdit({ zonasBDD }: Readonly<ZonesAgenteProps>) {
    const [showSubZones, setShowSubZones] = useState(false);


    // Convertir las zonas al formato GeoJSON
    const zonesGeoJSON = useMemo(() => ({
        type: "FeatureCollection",
        features: getZones(zonasBDD)
    }), [zonasBDD]);

    // Convertir las subzonas al formato GeoJSON
    const subZonesGeoJSON = useMemo(() => ({
        type: "FeatureCollection",
        features: getSubZones(zonasBDD)
    }), [zonasBDD]);

    return (
        <div className="relative flex flex-col w-full h-full">
        {
            zonasBDD && zonasBDD.length > 0 && (
                <div className="absolute top-3 left-3 z-10">
                    <Button
                        variant={showSubZones ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowSubZones(!showSubZones)}
                        className="flex items-center gap-2 shadow-md"
                    >
                        <Layers className="h-4 w-4" />
                        Subzonas
                    </Button>
                </div>
            )
        }

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
            >
                {/* Capa de Zonas */}
                {zonesGeoJSON.features.length > 0 && (
                    <Source id="zones-source" type="geojson" data={zonesGeoJSON}>
                        <Layer
                            id="zones-fill"
                            type="fill"
                            paint={{
                                "fill-color": ["get", "color"],
                                "fill-opacity": 0.2
                            }}
                        />
                        <Layer
                            id="zones-line"
                            type="line"
                            paint={{
                                "line-color": ["get", "color"],
                                "line-width": 2
                            }}
                        />
                        <Layer
                            id="zones-label"
                            type="symbol"
                            layout={{
                                "text-field": ["get", "name"],
                                "text-size": 14,
                                "text-anchor": "center"
                            }}
                            paint={{
                                "text-color": ["get", "color"]
                            }}
                        />
                    </Source>
                )}

                {/* Capa de Subzonas */}
                {showSubZones && subZonesGeoJSON.features.length > 0 && (
                    <Source id="subzones-source" type="geojson" data={subZonesGeoJSON}>
                        <Layer
                            id="subzones-fill"
                            type="fill"
                            paint={{
                                "fill-color": ["get", "parentColor"],
                                "fill-opacity": 0.1
                            }}
                        />
                        <Layer
                            id="subzones-line"
                            type="line"
                            paint={{
                                "line-color": ["get", "parentColor"],
                                "line-width": 1
                            }}
                        />
                        <Layer
                            id="subzones-label"
                            type="symbol"
                            layout={{
                                "text-field": ["get", "name"],
                                "text-size": 12,
                                "text-anchor": "center"
                            }}
                            paint={{
                                "text-color": ["get", "parentColor"]
                            }}
                        />
                    </Source>
                )}
            </Map>
        </div>
    );
}

function getZones(filteredZones: ZoneDtoWithSubZones[]): { type: string; properties: { name: string; color: string; }; geometry: { type: string; coordinates: number[][][]; }; }[] {
    return filteredZones.map(zone => ({
        type: "Feature",
        properties: {
            name: zone.zoneName,
            color: zone.zoneColor
        },
        geometry: {
            type: "Polygon",
            coordinates: [[...zone.geometry.coordinates.map(coord => [coord.latitude, coord.longitude])]]
        }
    }));
}

function getSubZones(filteredZones: ZoneDtoWithSubZones[]): { type: string; properties: { name: string; parentColor: string; }; geometry: { type: string; coordinates: number[][][]; }; }[] {
    return filteredZones.flatMap(zone => zone.SubZonas.map(subZone => ({
        type: "Feature",
        properties: {
            name: subZone.zoneName,
            parentColor: zone.zoneColor
        },
        geometry: {
            type: "Polygon",
            coordinates: [[...subZone.geometry.coordinates.map(coord => [coord.latitude, coord.longitude])]]
        }
    }))
    );
}
