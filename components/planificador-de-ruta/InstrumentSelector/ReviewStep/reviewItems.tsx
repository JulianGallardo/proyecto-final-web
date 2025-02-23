import { InstrumentoExtendido } from "@/types/instrumentoTypes";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Box, FileText, Hash, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Map } from "@mynaui/icons-react";
import IndicadorFecha from "@/components/instrumentos/Tabla/indicador-fecha";

interface InstrumentReviewItemProps {
    instrument: InstrumentoExtendido;
    handleToggleInstrument: (instrument: InstrumentoExtendido) => void;
}

export default function InstrumentReviewItem({ instrument, handleToggleInstrument }: Readonly<InstrumentReviewItemProps>) {
    return (
        <Card className={`
            transition-all duration-200 ease-in-out
        `}>
            <div className="flex items-start space-x-4 p-4">
                
                <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <label
                                htmlFor={instrument.codigoInstrumento}
                                className="text-base font-semibold text-gray-900 cursor-pointer hover:text-primary transition-colors"
                            >
                                {instrument.instrumentoType.name}
                            </label>
                            <span className="text-sm text-gray-500">
                                Orden {instrument.orden.ordenNumber}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                                {instrument.orden.juzgado.identifier}
                            </span>
                        </div>
                        <IndicadorFecha fecha={instrument.fecha_de_ingreso} urgencia={instrument.urgencia} />
                    </div>

                    <Accordion type="single" collapsible className="w-full border-none">
                        <AccordionItem value="details" className="border-none bg-white">
                            <AccordionTrigger className="py-2 text-sm hover:no-underline bg-white rounded-lg p-2 ">
                                <span className="">
                                    Detalles del instrumento
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-2">
                                {instrument.zoneName && (
                                    <div className="flex items-center gap-6 bg-gray-50 p-3 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Map className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm font-medium text-gray-700">Zona {instrument.zoneName}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-700">Subzona {instrument.subZona}</span>
                                        </div>
                                    </div>
                                )}

                                {instrument.caratula && (
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <FileText className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm font-medium">Carátula:</span>
                                        <span className="text-sm">{instrument.caratula}</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 text-gray-700">
                                    <Box className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm font-medium">Tipo:</span>
                                    <span className="text-sm">{instrument.instrumentoType.name}</span>
                                </div>

                                <div className="flex items-center gap-2 text-gray-700">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm font-medium">Dirección:</span>
                                    <span className="text-sm">{instrument.domicilio_denunciado}</span>
                                </div>

                                <div className="flex items-center gap-2 text-gray-700">
                                    <Hash className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm font-medium">Código:</span>
                                    <span className="text-sm">{instrument.codigoInstrumento}</span>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </Card>
    );
}