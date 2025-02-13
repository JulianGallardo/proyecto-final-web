import { InstrumentoExtendido } from "@/types/instrumentoTypes";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface InstrumentReviewItemProps {
    instrument: InstrumentoExtendido;
    handleToggleInstrument: (instrument: InstrumentoExtendido) => void;
}

export default function InstrumentReviewItem({ instrument, handleToggleInstrument }: Readonly<InstrumentReviewItemProps>) {
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
                                
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </CardContent>
        </Card>
    );
}