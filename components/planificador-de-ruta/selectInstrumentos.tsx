import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import type { InstrumentoExtendido } from "@/types/instrumentoTypes";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

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
    );
}

interface SelectStepProps {
    instruments: InstrumentoExtendido[];
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    selectedInstruments: InstrumentoExtendido[];
    handleToggleInstrument: (instrument: InstrumentoExtendido) => void;
    setStep: (value: "select" | "review") => void;
}

function SelectStep({ instruments, searchTerm, setSearchTerm, selectedInstruments, handleToggleInstrument, setStep }: Readonly<SelectStepProps>) {
    return (
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
                <ScrollArea className="h-max-screen border rounded-lg">
                    <div className="p-4 space-y-2 h-full">
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
    );
}

interface ReviewStepProps {
    selectedInstruments: InstrumentoExtendido[];
    handleToggleInstrument: (instrument: InstrumentoExtendido) => void;
    handleDistribute: () => void;
    setStep: (value: "select" | "review") => void;
}

function ReviewStep({ selectedInstruments, handleToggleInstrument, handleDistribute, setStep }: Readonly<ReviewStepProps>) {
    return (
        <Card className="shadow-lg">
            <CardHeader className="space-y-2">
                <CardTitle className="text-2xl font-bold">Revisar Selección</CardTitle>
                <CardDescription className="text-base">
                    {selectedInstruments.length} instrumentos seleccionados para distribución
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <ScrollArea className="h-max-screen border rounded-lg">
                    <div className="p-4 space-y-2">
                        {selectedInstruments.map((instrument) => (
                            <InstrumentReviewItem 
                                key={instrument.codigoInstrumento} 
                                instrument={instrument} 
                                handleToggleInstrument={handleToggleInstrument} 
                            />
                        ))}
                    </div>
                </ScrollArea>
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                    <Button 
                        variant="outline" 
                        onClick={() => setStep("select")}
                        className="w-full sm:w-auto"
                    >
                        Volver a Selección
                    </Button>
                    <Button 
                        onClick={handleDistribute}
                        className="w-full sm:w-auto"
                    >
                        Distribuir Instrumentos
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

interface InputSearchProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
}

function InputSearch({ searchTerm, setSearchTerm }: Readonly<InputSearchProps>) {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
                placeholder="Buscar por código, tipo, carátula o destinatario..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="pl-10 h-10"
            />
        </div>
    );
}

interface InstrumentItemProps {
    instrument: InstrumentoExtendido;
    selectedInstruments: InstrumentoExtendido[];
    handleToggleInstrument: (instrument: InstrumentoExtendido) => void;
}

function InstrumentItem({ instrument, selectedInstruments, handleToggleInstrument }: Readonly<InstrumentItemProps>) {
    const isSelected = selectedInstruments.some(
        (i) => i.codigoInstrumento === instrument.codigoInstrumento
    );

    return (
        <div 
            className={`
                flex items-start space-x-3 p-3 rounded-lg transition-colors
                ${isSelected ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-gray-50'}
            `}
        >
            <Checkbox 
                id={instrument.codigoInstrumento} 
                checked={isSelected}
                onCheckedChange={() => handleToggleInstrument(instrument)} 
                className="mt-1"
            />
            <div className="flex-1 space-y-1">
                <label 
                    htmlFor={instrument.codigoInstrumento} 
                    className="text-sm font-medium leading-none cursor-pointer"
                >
                    {instrument.instrumentoType.name} - {instrument.codigoInstrumento}
                </label>
                <Accordion type="single" collapsible className="w-full ">
                        <AccordionItem value="details" className="w-full">
                            <AccordionTrigger className="p-2 text-sm hover:no-underline">
                                Ver detalles del instrumento
                            </AccordionTrigger>
                            <AccordionContent className="space-y-2 p-2">
                                {instrument.zoneName && (
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium">Zona:</span>
                                        <span className="text-sm text-gray-500">{instrument.zoneName}</span>
                                    </div>
                                )}
                                {instrument.destinatario && (
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium">Destinatario:</span>
                                        <span className="text-sm text-gray-500">{instrument.destinatario}</span>
                                    </div>
                                )}
                                {instrument.caratula && (
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium">Carátula:</span>
                                        <span className="text-sm text-gray-500">{instrument.caratula}</span>
                                    </div>
                                )}
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium">Tipo:</span>
                                    <span className="text-sm text-gray-500">{instrument.instrumentoType.name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium">Código:</span>
                                    <span className="text-sm text-gray-500">{instrument.codigoInstrumento}</span>
                                </div>
                                {/* Aquí puedes agregar más campos del instrumento según necesites */}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
            </div>
        </div>
    );
}


interface InstrumentReviewItemProps {
    instrument: InstrumentoExtendido;
    handleToggleInstrument: (instrument: InstrumentoExtendido) => void;
}

function InstrumentReviewItem({ instrument, handleToggleInstrument }: Readonly<InstrumentReviewItemProps>) {
    return (
        <Card className="relative hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="space-y-2">
                    <div className="flex justify-between items-start">
                        <h3 className="font-semibold">
                            {instrument.instrumentoType.name} - {instrument.codigoInstrumento}
                        </h3>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleToggleInstrument(instrument)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="details" className="w-full">
                            <AccordionTrigger className="p-2 text-sm hover:no-underline">
                                Ver detalles del instrumento
                            </AccordionTrigger>
                            <AccordionContent className="space-y-2 p-2">
                                {instrument.zoneName && (
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium">Zona:</span>
                                        <span className="text-sm text-gray-500">{instrument.zoneName}</span>
                                    </div>
                                )}
                                {instrument.destinatario && (
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium">Destinatario:</span>
                                        <span className="text-sm text-gray-500">{instrument.destinatario}</span>
                                    </div>
                                )}
                                {instrument.caratula && (
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium">Carátula:</span>
                                        <span className="text-sm text-gray-500">{instrument.caratula}</span>
                                    </div>
                                )}
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium">Tipo:</span>
                                    <span className="text-sm text-gray-500">{instrument.instrumentoType.name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium">Código:</span>
                                    <span className="text-sm text-gray-500">{instrument.codigoInstrumento}</span>
                                </div>
                                {/* Aquí puedes agregar más campos del instrumento según necesites */}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </CardContent>
        </Card>
    );
}