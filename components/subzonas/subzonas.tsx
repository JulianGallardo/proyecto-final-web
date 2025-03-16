"use client";
import { useMemo, useState } from "react";
import { Map, Source, Layer } from "@vis.gl/react-maplibre";
import { MapBounds, MapCenter } from "@/types/MapTypes";
import { ExtendedZone, ZoneDtoWithSubZones } from "@/types/ZoneTypes";
import "maplibre-gl/dist/maplibre-gl.css";
import { Button } from "@/components/ui/button";
import { Layers} from "lucide-react";
import EditSidePanelSubzones from "./editSidePanel";
import { MaplibreTerradrawControl } from "@watergis/maplibre-gl-terradraw";
import TerraDrawHandlerSubZonas from "./terraDrawHandlerSubZonas";

interface ZonesAgenteProps {
    zonasBDD: ExtendedZone[];
    
}

export default function SubZonesEdit({ zonasBDD }: Readonly<ZonesAgenteProps>) {
    const [showSubZones, setShowSubZones] = useState(false);
    const [selectedZone, setSelectedZone] = useState<ExtendedZone | null>(null);
    const [editMode, setEditMode] = useState(false);

    // Convertir las zonas al formato GeoJSON
    const zonesGeoJSON = useMemo(() => ({
        type: "FeatureCollection",
        features: getZones(zonasBDD)
    }), [zonasBDD]);

    // Convertir las subzonas al formato GeoJSON
    const subZonesGeoJSON = useMemo(() => ({
        type: "FeatureCollection",
        features: getSubZones(selectedZone ? [selectedZone] : showSubZones ? zonasBDD : [])
    }), [zonasBDD, selectedZone, showSubZones]);

    // Función para manejar el clic en una zona
    const handleZoneClick = (event: any) => {
        const features = event.target.queryRenderedFeatures(event.point, { layers: ['zones-fill'] });

        if (features.length > 0) {
            const clickedZoneName = features[0].properties.name;
            const zone = zonasBDD.find(z => z.zoneName === clickedZoneName);

            if (zone) {
                setSelectedZone(zone);
                setShowSubZones(true);
            }
        }
    };

    // Función para salir del modo de edición y deseleccionar la zona
    const handleExitEdit = () => {
        setSelectedZone(null);
        setEditMode(false);
    };

    // Función para activar el modo de edición de subzonas
    const toggleEditMode = () => {
        setEditMode(!editMode);
    };

    return (
        <div className="relative flex flex-col w-full h-full">
            {/* Botón para mostrar/ocultar todas las subzonas */}
            {zonasBDD && zonasBDD.length > 0 && !selectedZone && (
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
            )}

            {/* Panel de edición de zona seleccionada */}
            {selectedZone && (
                <div className="absolute z-10 h-full w-full">
                    <TerraDrawHandlerSubZonas exitEditMode={handleExitEdit} selectedZone={selectedZone} />
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
                onClick={handleZoneClick}
                interactiveLayerIds={['zones-fill']}
                cursor={editMode ? 'crosshair' : 'pointer'}
            >
                {/* Capa de Zonas */}
                {zonesGeoJSON.features.length > 0 && (
                    <Source id="zones-source" type="geojson" data={zonesGeoJSON}>
                        <Layer
                            id="zones-fill"
                            type="fill"
                            paint={{
                                "fill-color": ["get", "color"],
                                "fill-opacity": selectedZone ?
                                    ["case", ["==", ["get", "name"], selectedZone.zoneName], 0.4, 0.1] : 0.2
                            }}
                        />
                        <Layer
                            id="zones-line"
                            type="line"
                            paint={{
                                "line-color": ["get", "color"],
                                "line-width": selectedZone ?
                                    ["case", ["==", ["get", "name"], selectedZone.zoneName], 3, 1] : 2
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
                {subZonesGeoJSON.features.length > 0 && (
                    <Source id="subzones-source" type="geojson" data={subZonesGeoJSON}>
                        <Layer
                            id="subzones-fill"
                            type="fill"
                            paint={{
                                "fill-color": ["get", "parentColor"],
                                "fill-opacity": editMode ? 0.3 : 0.1
                            }}
                        />
                        <Layer
                            id="subzones-line"
                            type="line"
                            paint={{
                                "line-color": ["get", "parentColor"],
                                "line-width": editMode ? 2 : 1,
                                "line-dasharray": editMode ? [2, 1] : [1, 0]
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