import { InstrumentoExtendido } from "@/types/instrumentoTypes";
import Map, { Marker, Popup, NavigationControl, FullscreenControl, GeolocateControl } from "@vis.gl/react-maplibre";
import { useState, useMemo } from 'react';
import { MapPin } from 'lucide-react';
import { MapCenter, MapBounds } from "@/types/MapTypes";

// Función auxiliar para validar coordenadas
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
}

export default function MapWithPopUps({ selectedInstruments }: Readonly<MapWithPopUpsProps>) {
    const [popupInfo, setPopupInfo] = useState<InstrumentoExtendido | null>(null);



    // Filtrar instrumentos seleccionados con coordenadas válidas
    const validSelectedInstruments = useMemo(() => {
        const valido = selectedInstruments.filter(instrument =>
            isValidCoordinate(instrument.latitude, instrument.longitude)
        );
        return valido;
    }, [selectedInstruments]);

    return (

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
                        <MapPin className="h-10 w-10 text-primary cursor-pointer hover:text-primary/80 transition-colors text-red-500" />
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

    );
}