"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {ChevronLeftIcon} from "lucide-react";
import Link from "next/link";
import { extractTextFromPDFAndParse } from "@/lib/readPdf";
import { createInstrumentos, deleteDuplicatePdfEntries } from "@/actions/instrumentos-actions";
import { InstrumentoDTO, InstrumentoDtoWithError, InstrumentPDFDTO } from "@/types/instrumentoTypes";
import { toast } from "@/hooks/use-toast";
import StepDataReview from "@/components/instrumentos/upload/Steps/StepDataReview";
import StepErrorReview from "@/components/instrumentos/upload/Steps/StepErrorReview";
import StepFileUpload from "@/components/instrumentos/upload/Steps/StepFileUpload";
import ConfirmStep from "@/components/instrumentos/upload/Steps/ConfirmStep";
import SaveInstrument from "@/components/instrumentos/upload/Steps/SaveInstruments";

const ITEMS_PER_PAGE = 10;


export default function PDFUploadProcess() {
    const [step, setStep] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<InstrumentoDTO[]>([]);
    const [instrumentosConErrores, setInstrumentosConErrores] = useState<InstrumentoDtoWithError[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isPending, startTransition] = useTransition();

    const handleFileUpload = async () => {
        if (!file) return;

        try {
            const parsedData = await extractTextFromPDFAndParse(file) as InstrumentPDFDTO[];
            if (!parsedData || parsedData.length === 0) throw new Error("No se encontraron instrumentos en el PDF");

            console.log("Parsed data", parsedData);

            const result = await deleteDuplicatePdfEntries(parsedData);

            
            if (!result || typeof result !== "object") throw new Error("Error al procesar el PDF");

            const { filteredInstrument, instrumentosWithErrors } = result; 

            if (filteredInstrument.length === 0 && instrumentosWithErrors.length === 0) {
                throw new Error("Los instrumentos en el PDF ya están cargados.");
            }

            setData(filteredInstrument);
            setInstrumentosConErrores(instrumentosWithErrors);
            setStep(instrumentosWithErrors.length ? 2 : 3);
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Ha ocurrido un error al procesar el PDF",
                className: "bg-red-500 text-white",
                duration: 3000,
            });
            setStep(1);
        }
    };


    const confirmUpload = async () => {
        try {
            setStep(4);
            startTransition(async () => {
                await createInstrumentos(data);
            });

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
            const index = instrumentosConErrores.findIndex((i) => i.caratula === instrument.caratula);
            if (index !== -1) {
                const newErrors = [...instrumentosConErrores];
                newErrors.splice(index, 1);
                setInstrumentosConErrores(newErrors);
                setData((prev) => [...prev, instrument]);
                console.log("New data", data);
            }
        }
    };

    const editInstrumentData = (instrument: InstrumentoDTO) => {
        const index = data.findIndex((i) => i.caratula === instrument.caratula);
        if (index !== -1) {
            const newData = [...data];
            newData.splice(index, 1, instrument);
            setData(newData);
        }
    };

    const deleteInstrumentData = (instrument: InstrumentoDTO) => {
        const index = data.findIndex((i) => i.caratula === instrument.caratula);
        if (index !== -1) {
            const newData = [...data];
            newData.splice(index, 1);
            setData(newData);
        }
    }

    const deleteInstrumentErrorData = (instrument: InstrumentoDTO) => {
        const index = instrumentosConErrores.findIndex((i) => i.caratula === instrument.caratula);
        if (index !== -1) {
            const newData = [...instrumentosConErrores];
            newData.splice(index, 1);
            setInstrumentosConErrores(newData);
        }
    }

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
                                deleteInstrumento={deleteInstrumentErrorData}
                                errors={instrumentosConErrores}
                                editInstrumentDataError={editInstrumentDataError}

                                onBack={() => setStep(1)}
                                onNext={() => setStep(3)}
                            />
                        )}

                        {step === 3 && (
                            <StepDataReview
                                data={data}
                                editInstrumentData={editInstrumentData}
                                deleteInstrumentData={deleteInstrumentData}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onNextPage={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                onPrevPage={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                onBack={() => setStep(1)}
                                onConfirm={confirmUpload}
                            />
                        )}

                        {step === 4 && (
                            isPending ? (
                                <SaveInstrument />
                            ) : (
                                <ConfirmStep onClick={() => {
                                    setFile(null);
                                    setData([]);
                                    setStep(1);
                                    setCurrentPage(1);
                                }} />
                            )
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
