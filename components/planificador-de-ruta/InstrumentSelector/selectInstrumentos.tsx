import { useState, useMemo } from "react";
import { X, MapPin, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { InstrumentoExtendido } from "@/types/instrumentoTypes";
import ReviewStep from "./ReviewStep/reviewStep";
import SelectStep from "./SelectStep/selectStep";
import MapWithPopUps from "../Maps/MapWithMarkers";
import { useIsMobile } from "@/hooks/use-mobile";
import { ExtendedZone } from "@/types/ZoneTypes";

interface InstrumentSelectorProps {
    instruments: InstrumentoExtendido[];
    handleSetInstrumentosARepartir: (instrumentos: InstrumentoExtendido[]) => void;
    zones: ExtendedZone[];
}

export default function InstrumentSelector({
    instruments,
    handleSetInstrumentosARepartir,
    zones
}: Readonly<InstrumentSelectorProps>) {
    const [selectedInstruments, setSelectedInstruments] = useState<InstrumentoExtendido[]>([]);
    const [message, setMessage] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState("");
    const [step, setStep] = useState<"select" | "review">("select");
    const [selectedZone, setSelectedZone] = useState<string>('');
    const [selectedSubZone, setSelectedSubZone] = useState<string>('');


    const filteredInstruments = useMemo(() => {
        const searchLower = searchTerm.toLowerCase().trim();

        return instruments.filter((instrument) => {
            // Primero verificamos los filtros de zona y subzona
            const matchesZone = selectedZone
                ? instrument.zoneName?.toLowerCase() === selectedZone.toLowerCase()
                : true;

            const matchesSubZone = selectedSubZone
                ? instrument.subZona?.toLowerCase() === selectedSubZone.toLowerCase()
                : true;

            // Luego verificamos el término de búsqueda
            const matchesSearch = searchLower
                ? instrument.codigoInstrumento.toLowerCase().includes(searchLower) ||
                instrument.caratula.toLowerCase().includes(searchLower) ||
                instrument.orden.ordenNumber.toString().includes(searchLower) ||
                instrument.orden.juzgado.identifier.toLowerCase().includes(searchLower) ||
                instrument.orden.juzgado.name.toLowerCase().includes(searchLower)

                : true;

            return matchesZone && matchesSubZone && matchesSearch;
        });
    }, [instruments, searchTerm, selectedZone, selectedSubZone]);

    const isMobile = useIsMobile();

    const handleToggleInstrument = (instrument: InstrumentoExtendido) => {
        setSelectedInstruments((prev) =>
            prev.some((i) => i.codigoInstrumento === instrument.codigoInstrumento)
                ? prev.filter((i) => i.codigoInstrumento !== instrument.codigoInstrumento)
                : [...prev, instrument]
        );
    };

    const handleDistribute = async () => {
        if (selectedInstruments.length === 0) {
            setMessage("Por favor, seleccione al menos un instrumento.");
            return;
        }
        handleSetInstrumentosARepartir(selectedInstruments);
    };

    return (
        <div className="flex flex-col w-full h-full">
            {isMobile &&
                <div className="h-full w-full">
                    <Tabs defaultValue="list" className="w-full">
                        <TabsList className="w-full ">
                            <TabsTrigger value="list" className="w-1/2" >
                                <List className="w-4 h-4 mr-2" />
                                Lista
                            </TabsTrigger>
                            <TabsTrigger value="map" className="w-1/2" >
                                <MapPin className="w-4 h-4 mr-2" />
                                Mapa
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="list" className="mt-0">
                            <div className="p-4">
                                {step === "select" ? (
                                    <SelectStep
                                        instruments={filteredInstruments}
                                        searchTerm={searchTerm}
                                        setSearchTerm={setSearchTerm}
                                        selectedInstruments={selectedInstruments}
                                        handleToggleInstrument={handleToggleInstrument}
                                        setStep={setStep}
                                        zones={zones}
                                        setSelectedSubZone={setSelectedSubZone}
                                        setSelectedZone={setSelectedZone}
                                    />
                                ) : (
                                    <ReviewStep
                                        selectedInstruments={selectedInstruments}
                                        handleToggleInstrument={handleToggleInstrument}
                                        handleDistribute={handleDistribute}
                                        setStep={setStep}

                                    />
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="map" className="h-[calc(100vh-11vh)] mt-0">
                            <div className="w-full h-full">
                                <MapWithPopUps selectedInstruments={selectedInstruments} zones={zones} />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            }
            {!isMobile &&
                <div className="hidden md:flex flex-row w-full h-full">
                    <div className="w-1/2 ">
                        {step === "select" ? (
                            <SelectStep
                                instruments={filteredInstruments}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                selectedInstruments={selectedInstruments}
                                handleToggleInstrument={handleToggleInstrument}
                                setStep={setStep}
                                zones={zones}
                                setSelectedSubZone={setSelectedSubZone}
                                setSelectedZone={setSelectedZone}
                            />
                        ) : (
                            <ReviewStep
                                selectedInstruments={selectedInstruments}
                                handleToggleInstrument={handleToggleInstrument}
                                handleDistribute={handleDistribute}
                                setStep={setStep}
                            />
                        )}
                    </div>
                    <div className="w-1/2 ">
                        <MapWithPopUps selectedInstruments={selectedInstruments} zones={zones}/>
                    </div>
                </div>
            }

            {message && (
                <Alert className="mt-4">
                    <AlertDescription className="flex items-center justify-between">
                        {message}
                        <Button variant="ghost" size="sm" onClick={() => setMessage("")}>
                            <X className="h-4 w-4" />
                        </Button>
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}