import { InstrumentoExtendido } from "@/types/instrumentoTypes";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent} from "../ui/accordion";
import { Checkbox } from "../ui/checkbox";

interface InstrumentItemProps {
    instrument: InstrumentoExtendido;
    selectedInstruments: InstrumentoExtendido[];
    handleToggleInstrument: (instrument: InstrumentoExtendido) => void;
}

export default function InstrumentItem({ instrument, selectedInstruments, handleToggleInstrument }: Readonly<InstrumentItemProps>) {
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
                className="mt-1 "
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
                        <AccordionTrigger className="p-2 text-sm hover:no-underline ">
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