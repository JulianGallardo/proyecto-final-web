import { InstrumentoExtendido } from "@/types/instrumentoTypes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import InputSearch from "./searchClient";
import InstrumentItem from "./instrumentItem";
import Map, { Marker, Popup } from "@vis.gl/react-maplibre";
import { useState, useMemo } from 'react';
import { MapPin } from 'lucide-react';
import { MapCenter, MapBounds } from "@/types/MapTypes";

interface SelectStepProps {
    instruments: InstrumentoExtendido[];
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    selectedInstruments: InstrumentoExtendido[];
    handleToggleInstrument: (instrument: InstrumentoExtendido) => void;
    setStep: (value: "select" | "review") => void;
}

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

export default function SelectStep({
    instruments,
    searchTerm,
    setSearchTerm,
    selectedInstruments,
    handleToggleInstrument,
    setStep
}: Readonly<SelectStepProps>) {
    const [popupInfo, setPopupInfo] = useState<InstrumentoExtendido | null>(null);

    // Filtrar instrumentos seleccionados con coordenadas válidas
    const validSelectedInstruments = useMemo(() => {
        const valido =  selectedInstruments.filter(instrument =>
            isValidCoordinate(instrument.latitude, instrument.longitude)
        );
        console.log("Valido",valido);
        return valido;
    }, [selectedInstruments]);



    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="shadow-lg">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-2xl font-bold">Seleccionar Instrumentos</CardTitle>
                    <CardDescription className="text-base">
                        Seleccione los instrumentos que desea distribuir
                        {selectedInstruments.length > 0 && (
                            <Badge variant="secondary" className="ml-2">
                                {selectedInstruments.length} seleccionados
                            </Badge>
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <InputSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    <ScrollArea className="h-[400px] border rounded-lg">
                        <div className="p-4 space-y-2">
                            {instruments.map((instrument) => (
                                <InstrumentItem
                                    key={instrument.codigoInstrumento}
                                    instrument={instrument}
                                    selectedInstruments={selectedInstruments}
                                    handleToggleInstrument={handleToggleInstrument}
                                />
                            ))}
                        </div>
                    </ScrollArea>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            onClick={() => setStep("review")}
                            disabled={selectedInstruments.length === 0}
                            className="w-full sm:w-auto"
                        >
                            Revisar Selección ({selectedInstruments.length})
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-lg">
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
                <CardContent>
                    <div className="h-[600px] w-full rounded-lg overflow-hidden">
                        <Map
                            style={{ width: '100%', height: '100%' }}
                            mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
                            initialViewState={
                                {
                                    latitude: MapCenter.lat,
                                    longitude: MapCenter.lng,
                                    zoom: 11.5
                                }
                            }
                            maxBounds={MapBounds}
                        >
                            {validSelectedInstruments.map((instrument) => (
                                <Marker
                                    key={instrument.codigoInstrumento}
                                    latitude={instrument.latitude}
                                    longitude={instrument.longitude}
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
                                    latitude={popupInfo.latitude}
                                    longitude={popupInfo.longitude}
                                    anchor="top"
                                    onClose={() => setPopupInfo(null)}
                                    className="z-50 p-2 border rounded-lg bg-transparent border-none shadow-lg"
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
                </CardContent>
            </Card>
        </div>
    );
}