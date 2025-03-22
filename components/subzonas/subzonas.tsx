"use client";
import { useMemo, useState, useRef, useEffect } from "react";
import { Map, Source, Layer, useMap, LngLatBoundsLike } from "@vis.gl/react-maplibre";
import { MapBounds, MapCenter } from "@/types/MapTypes";
import { ExtendedZone, ZoneDtoWithSubZones } from "@/types/ZoneTypes";
import "maplibre-gl/dist/maplibre-gl.css";
import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";
import TerraDrawHandlerSubZonas from "./terraDrawHandlerSubZonas";

interface ZonesAgenteProps {
    zonasBDD: ExtendedZone[];
}

export default function SubZonesEdit({ zonasBDD }: Readonly<ZonesAgenteProps>) {
    const [zoneBounds, setZoneBounds] = useState<number[][] | null>(null);
    const [showSubZones, setShowSubZones] = useState(false);
    const [selectedZone, setSelectedZone] = useState<ExtendedZone | null>(null);
    const [editMode, setEditMode] = useState(false);
    // Agregar una referencia al mapa
    const { mymap } = useMap();
    // Guardar la vista inicial para volver a ella
    const [initialViewState, setInitialViewState] = useState({
        longitude: MapCenter.lng,
        latitude: MapCenter.lat,
        zoom: 11.5
    });

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

    // Crear el GeoJSON para el sombreado (el inverso de la zona seleccionada)
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
                    // Primer array son las coordenadas externas (un rectángulo grande que cubre el mapa)
                    // Segundo array son las coordenadas de la zona seleccionada (agujero)
                    coordinates: [
                        // Un rectángulo grande que cubre el mapa (usar los límites máximos)
                        [
                            [MapBounds[0][0], MapBounds[0][1]],  // esquina suroeste
                            [MapBounds[0][0], MapBounds[1][1]],  // esquina noroeste
                            [MapBounds[1][0], MapBounds[1][1]],  // esquina noreste
                            [MapBounds[1][0], MapBounds[0][1]],  // esquina sureste
                            [MapBounds[0][0], MapBounds[0][1]],  // cerrar el polígono
                        ],
                        // El "agujero" con la forma de la zona seleccionada
                        selectedZoneCoordinates
                    ]
                }
            }]
        };
    }, [selectedZone]);

    // Función para calcular los límites de un polígono
    const calculateBounds = (coordinates: any[]) => {
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
        const features = event.target.queryRenderedFeatures(event.point, { layers: ['zones-fill'] });

        if (features.length > 0) {
            const clickedZoneName = features[0].properties.name;
            const zone = zonasBDD.find(z => z.zoneName === clickedZoneName);

            if (zone && !selectedZone) {
                // Guardar la vista actual antes de cambiarla
                const map = event.target;
                setInitialViewState({
                    longitude: map.getCenter().lng,
                    latitude: map.getCenter().lat,
                    zoom: map.getZoom()
                });

                setSelectedZone(zone);
                setShowSubZones(true);

                // Calcular límites de la zona seleccionada
                const coordinates = zone.geometry.coordinates.map(coord => [coord.latitude, coord.longitude]);
                const bounds = calculateBounds(coordinates);

                // Guardar los límites calculados
                setZoneBounds(bounds);

                // Registrar un evento para cuando el movimiento termine
                const mapInstance = mymap?.getMap();

                if (mapInstance) {
                    // Primero removemos cualquier listener previo para evitar duplicados


                    // Función que se ejecutará cuando termine el movimiento
                    const setMaxBoundsAfterFit = () => {
                        mapInstance.setMaxBounds(bounds as LngLatBoundsLike);
                        // Removemos el listener después de usarlo
                        mapInstance.off('moveend', setMaxBoundsAfterFit);
                    };
                    mapInstance.off('moveend', setMaxBoundsAfterFit);
                    // Añadimos el listener
                    mapInstance.on('moveend', setMaxBoundsAfterFit);

                    // Hacemos el fitBounds que disparará el evento moveend cuando termine
                    mapInstance.fitBounds(bounds as LngLatBoundsLike, {
                        padding: 50,
                        zoom: 14.2,
                        duration: 1000
                    });
                }
            }
        }
    };

    // Función para salir del modo de edición y deseleccionar la zona
    const handleExitEdit = () => {
        setSelectedZone(null);
        setEditMode(false);
        setZoneBounds(null); // Restaurar los límites originales

        // Hacer zoom out a la vista inicial
        if (mymap) {
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