import { InstrumentoExtendido } from "@/types/instrumentoTypes";
import Map, { Marker, Popup, NavigationControl, FullscreenControl, GeolocateControl, Layer, Source } from "@vis.gl/react-maplibre";
import { useState, useMemo, useEffect } from 'react';
import { MapPin, Layers } from 'lucide-react';
import { MapCenter, MapBounds } from "@/types/MapTypes";
import { ExtendedZone } from "@/types/ZoneTypes";
import { Button } from "@/components/ui/button";

const isValidCoordinate = (lat: number | undefined | null, lng: number | undefined | null): boolean => {
    return (
        typeof lat === 'number' &&
        typeof lng === 'number' &&
        !isNaN(lat) &&
        !isNaN(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
    );
};

interface MapWithPopUpsProps {
    selectedInstruments: InstrumentoExtendido[];
    zones?: ExtendedZone[];
}

export default function MapWithPopUps({ selectedInstruments, zones }: Readonly<MapWithPopUpsProps>) {
    const [popupInfo, setPopupInfo] = useState<InstrumentoExtendido | null>(null);
    const [showZones, setShowZones] = useState(false);
    const [showSubZones, setShowSubZones] = useState(false);

    const validSelectedInstruments = useMemo(() => {
        return selectedInstruments.filter(instrument =>
            isValidCoordinate(instrument.latitude, instrument.longitude)
        );
    }, [selectedInstruments]);

    // Convertir las zonas al formato GeoJSON con sus colores personalizados
    const zonesGeoJSON = useMemo(() => {
        if (!zones) return null;
        return {
            type: 'FeatureCollection',
            features: zones.map(zone => ({
                type: 'Feature',
                properties: {
                    name: zone.zoneName,
                    color: zone.zoneColor // Usar el color definido en la base de datos
                },
                geometry: {
                    type: 'Polygon',
                    coordinates: [[...zone.geometry.coordinates.map(coord => [coord.latitude, coord.longitude])]]
                }
            }))
        };

    }, [zones]);

    // Convertir las subzonas al formato GeoJSON
    const subZonesGeoJSON = useMemo(() => {
        if (!zones) return null;
        return {
            type: 'FeatureCollection',
            features: zones.flatMap(zone =>
                zone.SubZonas.map(subZone => ({
                    type: 'Feature',
                    properties: {
                        name: subZone.zoneName,
                        parentColor: zone.zoneColor // Usar una variación del color de la zona padre
                    },
                    geometry: {
                        type: 'Polygon',
                        coordinates: [[...subZone.geometry.coordinates.map(coord => [coord.latitude, coord.longitude])]]
                    }
                }))
            )
        };
    }, [zones]);


    return (
        <div className="relative w-full h-full">
            {
                zones && zones.length > 0 && (
                    <div className="absolute top-4 left-3 z-10 flex gap-2">

                        <Button
                            variant={showZones ? "default" : "outline"}
                            size="sm"
                            onClick={() => setShowZones(!showZones)}
                            className="flex items-center gap-2"
                        >
                            <Layers className="h-4 w-4" />
                            Zonas
                        </Button>
                        <Button
                            variant={showSubZones ? "default" : "outline"}
                            size="sm"
                            onClick={() => setShowSubZones(!showSubZones)}
                            className="flex items-center gap-2"
                        >
                            <Layers className="h-4 w-4" />
                            Subzonas
                        </Button>
                    </div>
                )
            }


            <Map
                id="map"
                mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
                initialViewState={{
                    latitude: MapCenter.lat,
                    longitude: MapCenter.lng,
                    zoom: 11.5,
                    bearing: 0,
                    pitch: 0
                }}
                maxBounds={MapBounds}
                style={{ width: '100%', height: '100%' }}
                reuseMaps={true}
            >
                <NavigationControl showCompass={false} />
                <FullscreenControl />
                <GeolocateControl />

                {/* Capa de Zonas con colores personalizados */}
                {showZones && zonesGeoJSON && (
                    <Source id="zones-source" type="geojson" data={zonesGeoJSON}>
                        <Layer
                            id="zones-fill"
                            type="fill"
                            paint={{
                                'fill-color': ['get', 'color'],
                                'fill-opacity': 0.2
                            }}
                        />
                        <Layer
                            id="zones-line"
                            type="line"
                            paint={{
                                'line-color': ['get', 'color'],
                                'line-width': 2
                            }}
                        />
                        <Layer
                            id="zones-label"
                            type="symbol"
                            layout={{
                                'text-field': ['get', 'name'],
                                'text-size': 14,
                                'text-anchor': 'center'
                            }}
                            paint={{
                                'text-color': ['get', 'color']
                            }}
                        />
                    </Source>
                )}

                {/* Capa de Subzonas con colores derivados */}
                {showSubZones && subZonesGeoJSON && (
                    <Source id="subzones-source" type="geojson" data={subZonesGeoJSON}>
                        <Layer
                            id="subzones-fill"
                            type="fill"
                            paint={{
                                'fill-color': ['get', 'parentColor'],
                                'fill-opacity': 0.1
                            }}
                        />
                        <Layer
                            id="subzones-line"
                            type="line"
                            paint={{
                                'line-color': ['get', 'parentColor'],
                                'line-width': 1
                            }}
                        />
                        <Layer
                            id="subzones-label"
                            type="symbol"
                            layout={{
                                'text-field': ['get', 'name'],
                                'text-size': 12,
                                'text-anchor': 'center'
                            }}
                            paint={{
                                'text-color': ['get', 'parentColor']
                            }}
                        />
                    </Source>
                )}

                {validSelectedInstruments.map((instrument) => (
                    <Marker
                        key={instrument.codigoInstrumento}
                        latitude={instrument.latitude!}
                        longitude={instrument.longitude!}
                        anchor="bottom"
                        onClick={(e: { originalEvent: { stopPropagation: () => void; }; }) => {
                            e.originalEvent.stopPropagation();
                            setPopupInfo(instrument);
                        }}
                    >
                        <div className="relative group">
                            <MapPin className="h-10 w-10 cursor-pointer hover:text-primary/80 transition-colors text-red-500" />
                            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs">
                                {instrument.instrumentoType.name} - {instrument.codigoInstrumento}
                            </div>
                        </div>
                    </Marker>
                ))}

                {popupInfo && (
                    <Popup
                        latitude={popupInfo.latitude!}
                        longitude={popupInfo.longitude!}
                        anchor="top"
                        onClose={() => setPopupInfo(null)}
                        className="z-50 p-2 border rounded-lg bg-white border-none shadow-lg"
                    >
                        <div className="p-2">
                            <h3 className="font-semibold">{popupInfo.instrumentoType.name}</h3>
                            <p className="text-sm">Código: {popupInfo.codigoInstrumento}</p>
                            <p className="text-sm">Dirección: {popupInfo.domicilio_denunciado}</p>
                            {popupInfo.zoneName && (
                                <p className="text-sm">Zona: {popupInfo.zoneName}</p>
                            )}
                        </div>
                    </Popup>
                )}
            </Map>
        </div>
    );
}