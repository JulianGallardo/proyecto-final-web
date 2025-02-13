import { useState, useMemo } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { InstrumentoExtendido } from "@/types/instrumentoTypes";
import ReviewStep from "./reviewStep";
import SelectStep from "./selectStep";


interface InstrumentSelectorProps {
    instruments: InstrumentoExtendido[];
    handleSetInstrumentosARepartir: (instrumentos: InstrumentoExtendido[]) => void;
}

export default function InstrumentSelector({ instruments, handleSetInstrumentosARepartir }: Readonly<InstrumentSelectorProps>) {
    const [selectedInstruments, setSelectedInstruments] = useState<InstrumentoExtendido[]>([]);
    const [message, setMessage] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState("");
    const [step, setStep] = useState<"select" | "review">("select");

    const filteredInstruments = useMemo(() => {
        return instruments.filter((instrument) => {
            const searchLower = searchTerm.toLowerCase();
            return (
                instrument.codigoInstrumento.toLowerCase().includes(searchLower) ||
                instrument.instrumentoType.name.toLowerCase().includes(searchLower) ||
                instrument.caratula.toLowerCase().includes(searchLower) ||
                instrument.destinatario.toLowerCase().includes(searchLower) ||
                (instrument.zoneName?.toLowerCase().includes(searchLower) ?? false)
            );
        });
    }, [instruments, searchTerm]);

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
        <div className="flex flex-col space-y-4 w-full h-full p-4">
            <div className="space-y-4 w-full h-full p-4">
                {step === "select" ? (
                    <SelectStep
                        instruments={filteredInstruments}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectedInstruments={selectedInstruments}
                        handleToggleInstrument={handleToggleInstrument}
                        setStep={setStep}
                    />
                ) : (
                    <ReviewStep
                        selectedInstruments={selectedInstruments}
                        handleToggleInstrument={handleToggleInstrument}
                        handleDistribute={handleDistribute}
                        setStep={setStep}
                    />
                )}
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
        </div>
    );
}


