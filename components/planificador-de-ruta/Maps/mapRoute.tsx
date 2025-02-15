import { MapCenter, MapBounds } from "@/types/MapTypes";
import { Address, RouteSegment } from "@/types/PlannerTypes";

import { HomeIcon, MapPin, MapPinCheck } from "lucide-react";
import Map, { Marker, Popup, Source, Layer, GeolocateControl, FullscreenControl, NavigationControl } from "@vis.gl/react-maplibre";
import { InstrumentoExtendido } from "@/types/instrumentoTypes";
import { Flag } from "@mynaui/icons-react";
import { useState } from "react";

interface MapComponentProps {
    selectedInstruments: InstrumentoExtendido[];
    orderedAddresses: Address[];
    routeSegments?: RouteSegment[];
}




function calculateIcon(address: Address) {

    if (address.visited) {
        return <MapPinCheck className="h-10 w-10 text-green-500" />
    }

    if (address.type === "start") {
        return <HomeIcon className="h-10 w-10 text-blue-500" />
    }
    if (address.type === "end") {
        return <Flag className="h-10 w-10 text-black" />
    }
    else {
        return <MapPin className="h-10 w-10 text-red-500" />
    }




}



function calculateMarker(Address: Address, index: number) {
    return (
        <div className="relative inline-block">
            {calculateIcon(Address)}

            {Address.type === "waypoint" && (
                <span className="absolute -top-2 -right-2 bg-red-800 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {index}
                </span>
            )}
        </div>
    );
}
export function MapComponent({ selectedInstruments, orderedAddresses, routeSegments }: Readonly<MapComponentProps>) {
    const [popupInfo, setPopupInfo] = useState<InstrumentoExtendido | null>(null);



    return (
        <Map
            id="map"
            mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
            initialViewState={{
                latitude: MapCenter.lat,
                longitude: MapCenter.lng,
                zoom: 11.5,
                bearing: 0,
                pitch: 0,
            }}
            maxBounds={MapBounds}
            style={{ width: '100%', height: '100%' }}
            attributionControl={true}
            reuseMaps

        >
            <NavigationControl showCompass={false} />
            <FullscreenControl />
            <GeolocateControl
                positionOptions={{ enableHighAccuracy: true }}
                trackUserLocation={true}
                showUserLocation={true}


            />

            {orderedAddresses.length === 0 && selectedInstruments.map((instrument) => (
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
                        <MapPin className="h-10 w-10 text-primary cursor-pointer hover:text-primary/80 transition-colors text-red-500" />
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs">
                            {instrument.instrumentoType?.name} - {instrument.codigoInstrumento}
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
                        <h3 className="font-semibold">{popupInfo.instrumentoType?.name}</h3>
                        <p className="text-sm">Código: {popupInfo.codigoInstrumento}</p>
                        <p className="text-sm">Dirección: {popupInfo.domicilio_denunciado}</p>
                        {popupInfo.zoneName && (
                            <p className="text-sm">Zona: {popupInfo.zoneName}</p>
                        )}
                    </div>
                </Popup>
            )}

            {orderedAddresses.map((address, index) => (

                <Marker
                    key={address.instrument?.codigoInstrumento ?? index}
                    latitude={address.coordinates?.[1]}
                    longitude={address.coordinates?.[0]}
                    anchor="bottom"
                >
                    <div className="relative group">
                        {
                            calculateMarker(address, address.stopNumber)
                        }

                        {address.instrument &&
                            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs">
                                {address.instrument?.instrumentoType?.name} - {address.instrument?.codigoInstrumento}
                            </div>
                        }
                        {
                            !address.instrument &&
                            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs">
                                {
                                    address.type === 'start' && "Inicio "
                                }
                                {
                                    address.type === 'end' && "Fin "
                                }
                                -

                                {address.text}
                            </div>
                        }
                    </div>
                </Marker>

            ))}

            {routeSegments?.map((segment, index) => {
                const sourceId = `route-source-${index}`;
                const layerId = `route-line-${index}`;

                return (
                    <Source
                        key={sourceId}
                        id={sourceId}
                        type="geojson"
                        data={{
                            type: 'Feature',
                            properties: { description: segment.description },
                            geometry: {
                                type: 'LineString',
                                coordinates: segment.coordinates,
                            },
                        }}
                    >
                        <Layer
                            id={layerId}
                            type="line"
                            layout={{
                                'line-join': 'round',
                                'line-cap': 'round',
                            }}
                            paint={{
                                'line-color': `hsl(${index * 30}, 70%, 50%)`,  // Color dinámico
                                'line-width': 6,
                                'line-opacity': 0.8,
                            }}
                        />
                    </Source>
                );
            })}
        </Map>
    );
}
