"use client";
import { useMemo, useState } from "react";
import { Map, Source, Layer, useMap, LngLatBoundsLike } from "@vis.gl/react-maplibre";
import { MapBounds, MapCenter } from "@/types/MapTypes";
import { ExtendedZone, ZoneDtoWithSubZones } from "@/types/ZoneTypes";
import "maplibre-gl/dist/maplibre-gl.css";
import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";
import TerraDrawHandlerSubZonas from "./terraDrawHandlerSubZonas";
import { LoadSkeleton } from "../areas/maps/map";

interface ZonesAgenteProps {
    zonasBDD: ExtendedZone[];
}

export default function SubZonesEdit({ zonasBDD }: Readonly<ZonesAgenteProps>) {
    const [showSubZones, setShowSubZones] = useState(false);
    const [selectedZone, setSelectedZone] = useState<ExtendedZone | null>(null);
    const [editMode, setEditMode] = useState(false);
    const { mymap } = useMap();
    const [initialViewState, setInitialViewState] = useState({
        longitude: MapCenter.lng,
        latitude: MapCenter.lat,
        zoom: 11.5
    });
    const [loading, setLoading] = useState(false);


    const zonesGeoJSON = useMemo(() => ({
        type: "FeatureCollection",
        features: getZones(zonasBDD)
    }), [zonasBDD]);

    const subZonesGeoJSON = useMemo(() => ({
        type: "FeatureCollection",
        features: getSubZones(selectedZone ? [selectedZone] : showSubZones ? zonasBDD : [])
    }), [zonasBDD, selectedZone, showSubZones]);

    const maskGeoJSON = useMemo(() => {
        if (!selectedZone) return null;

        // Obtener las coordenadas de la zona seleccionada
        const selectedZoneCoordinates = selectedZone.geometry.coordinates.map(
            coord => [coord.latitude, coord.longitude]
        );


        return {
            type: "FeatureCollection",
            features: [{
                type: "Feature",
                properties: {},
                geometry: {
                    type: "Polygon",
                    
                    coordinates: [
                        [
                            [MapBounds[0][0], MapBounds[0][1]],  // esquina suroeste
                            [MapBounds[0][0], MapBounds[1][1]],  // esquina noroeste
                            [MapBounds[1][0], MapBounds[1][1]],  // esquina noreste
                            [MapBounds[1][0], MapBounds[0][1]],  // esquina sureste
                            [MapBounds[0][0], MapBounds[0][1]],  // cerrar el polígono
                        ],
                        selectedZoneCoordinates
                    ]
                }
            }]
        };
    }, [selectedZone]);

    // Función para calcular los límites de un polígono
    const calculateBounds = (coordinates: number[][]) => {
        let minLat = Infinity;
        let maxLat = -Infinity;
        let minLng = Infinity;
        let maxLng = -Infinity;

        coordinates.forEach(coord => {
            minLat = Math.min(minLat, coord[0]);
            maxLat = Math.max(maxLat, coord[0]);
            minLng = Math.min(minLng, coord[1]);
            maxLng = Math.max(maxLng, coord[1]);
        });

        const paddingFactor = 0.7;
        const latRange = maxLat - minLat;
        const lngRange = maxLng - minLng;

        minLat = minLat - latRange * paddingFactor;
        maxLat = maxLat + latRange * paddingFactor;
        minLng = minLng - lngRange * paddingFactor;
        maxLng = maxLng + lngRange * paddingFactor;

        // Format to 6 decimal places
        minLat = parseFloat(minLat.toFixed(6));
        maxLat = parseFloat(maxLat.toFixed(6));
        minLng = parseFloat(minLng.toFixed(6));
        maxLng = parseFloat(maxLng.toFixed(6));

        return [
            [minLat, minLng], // suroeste
            [maxLat, maxLng]  // noreste
        ];
    };

    // Función para manejar el clic en una zona
    const handleZoneClick = (event: any) => {
        if(selectedZone) return;


        const features = event.target.queryRenderedFeatures(event.point, { layers: ['zones-fill'] });

        if (features.length > 0 ) {
            console.log("click en zona", features[0].properties.name);
            const clickedZoneName = features[0].properties.name;
            const zone = zonasBDD.find(z => z.zoneName === clickedZoneName);

            if (zone ) {
                const map = event.target;
                setInitialViewState({
                    longitude: map.getCenter().lng,
                    latitude: map.getCenter().lat,
                    zoom: map.getZoom()
                });

                setSelectedZone(zone);

                const coordinates = zone.geometry.coordinates.map(coord => [coord.latitude, coord.longitude]);
                const bounds = calculateBounds(coordinates);



                const mapInstance = mymap?.getMap();

                if (mapInstance) {


                    const setMaxBoundsAfterFit = () => {
                        mapInstance.setMaxBounds(bounds as LngLatBoundsLike);
                        mapInstance.off('moveend', setMaxBoundsAfterFit);
                    };
                    mapInstance.off('moveend', setMaxBoundsAfterFit);
                  
                    mapInstance.on('moveend', setMaxBoundsAfterFit);

                    mapInstance.fitBounds(bounds as LngLatBoundsLike, {
                        padding: 50,
                        zoom: 14.2,
                        duration: 1000
                    });
                }
            }
        }
    };

    const handleExitEdit = () => {
        setSelectedZone(null);
        setEditMode(false);
        if (mymap) {
            mymap.getSource("subzones-edit-source")?.setData({
                type: "FeatureCollection",
                features: []
            });
            mymap.getMap().setMaxBounds(MapBounds as LngLatBoundsLike);
            mymap.getMap().setMinZoom(null);
            mymap.flyTo({
                center: [initialViewState.longitude, initialViewState.latitude],
                zoom: initialViewState.zoom,
                duration: 1000
            });

        }
    };




    return (
        <div className="relative flex flex-col w-full h-full">


            {
                loading && <LoadSkeleton />
            }

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
                <div className="absolute z-10 h-full ">
                    <TerraDrawHandlerSubZonas exitEditMode={handleExitEdit} selectedZone={selectedZone} setLoading={setLoading} />
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
                style={{ width: "100%", height: "100%" }}
                mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
                onClick={handleZoneClick}
                interactiveLayerIds={['zones-fill']}
                cursor={editMode ? 'crosshair' : 'pointer'}


            >
                {/* Capa de sombreado para áreas fuera de la zona seleccionada */}
                {selectedZone && maskGeoJSON && (
                    <Source id="mask-source" type="geojson" data={maskGeoJSON}>
                        <Layer
                            id="mask-fill"
                            type="fill"
                            paint={{
                                "fill-color": "#888888",
                                "fill-opacity": 0.5
                            }}
                        />
                    </Source>
                )}

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
                {subZonesGeoJSON.features.length > 0 && !selectedZone && (
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

                <Source
                    id="subzones-edit-source"
                    type="geojson"
                    data={{
                        type: "FeatureCollection",
                        features: [
                            // Your features array here
                        ]
                    }}
                >
                    <Layer
                        id="subzones-edit-label"
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