import { Button } from "@/components/ui/button";
import { InstrumentoDtoWithError, InstrumentoDTO } from "@/types/instrumentoTypes";
import { FileIcon, Edit } from "lucide-react";

export interface ErrorListProps {
    title: string;
    instrumentErrors: InstrumentoDtoWithError[];
    handleSetInstrumentoEditando: (instrumento: InstrumentoDTO) => void;
    onCancelarCarga: (instrumento: InstrumentoDTO) => void;
}

/** Error List Component */
export default function ErrorList({ title, instrumentErrors, handleSetInstrumentoEditando, onCancelarCarga }: Readonly<ErrorListProps>) {
    return (
        <div className="flex flex-col gap-6 p-4 bg-red-50 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-red-700 border-b border-red-300 pb-2">{title}</h3>
            <ul className="space-y-4">
                {instrumentErrors.map((error, index) => (
                    <li
                        key={"Instrument_with_errors" + index}
                        className="flex flex-col gap-3 bg-red-100 p-4 rounded-lg shadow-sm border border-red-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <FileIcon className="h-6 w-6 text-red-600" />
                            <span className="text-base font-medium text-gray-900">{error.caratula}</span>
                        </div>
                        <div className="flex flex-col gap-3 ">
                            <div className="flex flex-row items-center gap-2">
                                <Edit className="h-6 w-6 text-red-600" />
                                <span className="text-sm font-medium text-red-600">Ocurrieron los siguientes errores:</span>
                                <span className="text-sm font-medium text-red-600">{error.error}</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                {
                                    error.error === "Juzgado y tipo de instrumento inválidos" && (
                                        <>
                                            <span className="text-sm font-medium text-red-600">
                                                Juzgado en pdf: {error.juzgadoIdentifier}
                                            </span><span className="text-sm font-medium text-red-600">
                                                Tipo de instrumento en pdf: {error.instrumentoTypeIdentifier}
                                            </span>
                                        </>
                                    )
                                }
                                {
                                    error.error === "Tipo de instrumento inválido" && (
                                        <span className="text-sm font-medium text-red-600">
                                            Tipo de instrumento en pdf: {error.instrumentoTypeIdentifier}
                                        </span>
                                    )
                                }
                                {
                                    error.error === "Juzgado inválido" && (
                                        <span className="text-sm font-medium text-red-600">
                                            Juzgado en pdf: {error.juzgadoIdentifier}
                                        </span>
                                    )
                                }
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row md:justify-between gap-2">
                            <Button
                                className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
                                onClick={() => handleSetInstrumentoEditando(error)}
                            >
                                Completar Información
                            </Button>
                            <Button
                                className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
                                onClick={() => onCancelarCarga(error)}
                            >
                                Cancelar Carga
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}