"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    CheckIcon,
    ChevronLeftIcon,
} from "lucide-react";
import Link from "next/link";
import { extractTextFromPDFAndParse } from "@/lib/readPdf";
import { createInstrumentoFromPDF, deleteDuplicatePdfEntries } from "@/actions/instrumentos-actions";
import { InstrumentoDTO, InstrumentPDFDTO } from "@/types/instrumentoTypes";
import { toast } from "@/hooks/use-toast";
import StepDataReview from "@/components/instrumentos/upload/Steps/StepDataReview";
import StepErrorReview from "@/components/instrumentos/upload/Steps/StepErrorReview";
import StepFileUpload from "@/components/instrumentos/upload/Steps/StepFileUpload";

const ITEMS_PER_PAGE = 10;


/** Main Component */
export default function PDFUploadProcess() {
    const [step, setStep] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<InstrumentoDTO[]>([]);
    const [instrumentsWithJuzgadoError, setInstrumentsWithJuzgadoError] = useState<InstrumentoDTO[]>([]);
    const [instrumentsWithInstrumentTypeError, setInstrumentsWithInstrumentTypeError] = useState<InstrumentoDTO[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const handleFileUpload = async () => {
        if (file) {
            try {
                const parsedData = await extractTextFromPDFAndParse(file) as InstrumentPDFDTO[];
                if (!parsedData) throw new Error("No se pudo extraer información del PDF");

                const { filteredInstrument, instrumentsWithJuzgadoError, instrumentsWithInstrumentTypeError } = await deleteDuplicatePdfEntries(parsedData);

                setInstrumentsWithJuzgadoError(instrumentsWithJuzgadoError);
                setInstrumentsWithInstrumentTypeError(instrumentsWithInstrumentTypeError);
                setData(filteredInstrument);

                setStep(instrumentsWithJuzgadoError.length || instrumentsWithInstrumentTypeError.length ? 2 : 3);
            } catch (error) {
                toast({
                    title: "Error",
                    description: error instanceof Error ? error.message : "Ha ocurrido un error al procesar el PDF",
                    className: "bg-red-500 text-white",
                    duration: 3000,
                });
            }
        }
    };

    const confirmUpload = async () => {
        try {
            for (const element of data) {
                await createInstrumentoFromPDF(element);
            }
            setStep(4);
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Ha ocurrido un error al crear el instrumento",
                className: "bg-red-500 text-white",
                duration: 3000,
            });
        }
    };



    const editInstrumentDataError = (instrument: InstrumentoDTO) => {
        if (instrument.juzgadoIdentifier !== "" && instrument.instrumentoTypeIdentifier !== "") {
            setInstrumentsWithJuzgadoError((prev) => prev.filter((item) => item.caratula !== instrument.caratula));
            setInstrumentsWithInstrumentTypeError((prev) => prev.filter((item) => item.caratula !== instrument.caratula));
            setData((prev) => [...prev, instrument]);
        }
    };

    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

    return (
        <div className="flex flex-col items-center w-full h-full py-4 gap-2 px-2 overflow-x-hidden">
            <div className="flex flex-col gap-4 w-full max-w-3xl">
                <Link href="/instrumentos" className="flex flex-row items-center gap-2 w-fit">
                    <Button variant="outline" className="flex flex-row w-fit gap-2">
                        <ChevronLeftIcon className="h-4 w-4" />
                        Volver al listado
                    </Button>
                </Link>

                <Card className="w-full max-w-3xl shadow-md">
                    <CardContent className="p-8">
                        {step === 1 && (
                            <StepFileUpload
                                file={file}
                                onFileChange={setFile}
                                onNext={handleFileUpload}
                            />
                        )}

                        {step === 2 && (
                            <StepErrorReview
                                data={data}
                                errors={{
                                    juzgadoErrors: instrumentsWithJuzgadoError,
                                    typeErrors: instrumentsWithInstrumentTypeError
                                }}
                                editInstrumentDataError={editInstrumentDataError}

                                onBack={() => setStep(1)}
                                onNext={() => setStep(3)}
                            />
                        )}

                        {step === 3 && (
                            <StepDataReview
                                data={data}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onNextPage={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                onPrevPage={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                onBack={() => setStep(1)}
                                onConfirm={confirmUpload}
                            />
                        )}

                        {step === 4 && (
                            <div className="flex flex-col gap-2 text-center items-center justify-center w-full h-full">
                                <CheckIcon className="h-12 w-12 text-green-500" />
                                <h2 className="text-2xl font-semibold text-gray-800">¡Carga confirmada!</h2>
                                <p className="text-gray-600">Tus datos han sido procesados correctamente.</p>
                                <div className="flex flex-row items-center justify-center gap-4">
                                    <Button onClick={() => {
                                        setFile(null);
                                        setData([]);
                                        setStep(1);
                                        setCurrentPage(1);
                                    }}>
                                        Cargar otro archivo
                                    </Button>
                                    <Link href="/instrumentos">
                                        <Button variant="outline">Volver al listado</Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
