import { InstrumentoExtendido } from "@/types/instrumentoTypes";

import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import Map, { Marker, Popup, NavigationControl, FullscreenControl, GeolocateControl } from "@vis.gl/react-maplibre";
import { useState, useMemo} from 'react';
import { MapPin } from 'lucide-react';
import { MapCenter, MapBounds } from "@/types/MapTypes";
import MapWithPopUps from "../Maps/MapWithMarkers";

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

export default function MapWithInstruments({ selectedInstruments }: Readonly<MapWithPopUpsProps>) {


    // Filtrar instrumentos seleccionados con coordenadas válidas
    const validSelectedInstruments = useMemo(() => {
        const valido = selectedInstruments.filter(instrument =>
            isValidCoordinate(instrument.latitude, instrument.longitude)
        );
        return valido;
    }, [selectedInstruments]);

    return (
        <Card className="shadow-lg h-full flex flex-col">
            <CardHeader>
                <CardTitle className="text-xl font-bold">
                    Ubicación de Instrumentos
                    {validSelectedInstruments.length > 0 && (
                        <Badge variant="secondary" className="ml-2">
                            {validSelectedInstruments.length} en mapa
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-[500px]">
                <div className="h-full w-full rounded-lg overflow-hidden relative">
                    <MapWithPopUps selectedInstruments={validSelectedInstruments} />
                </div>
            </CardContent>
        </Card>
    );
}