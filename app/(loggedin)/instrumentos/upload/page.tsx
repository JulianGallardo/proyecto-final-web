"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    UploadIcon,
    FileIcon,
    CheckIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "lucide-react";
import Link from "next/link";
import { extractTextFromPDFAndParse } from "@/lib/readPdf";
import { createInstrumentoFromPDF, deleteDuplicatePdfEntries } from "@/actions/instrumentos-actions";
import { InstrumentPDFDTO } from "@/types/instrumento";
import { toast } from "@/hooks/use-toast";
import ClipLoader from "react-spinners/ClipLoader";

const ITEMS_PER_PAGE = 10;

/** Step 1: File Upload Component */
function StepFileUpload({ file, onFileChange, onNext }: Readonly<{
    file: File | null;
    onFileChange: (file: File | null) => void;
    onNext: () => Promise<void>;
}>) {


    const [loading, setLoading] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        const selectedFile = event.target.files?.[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            onFileChange(selectedFile);
        } else {
            onFileChange(null);
            alert("Por favor, selecciona un archivo PDF válido.");
        }
    };

    const handleOnNext = async () => {
        setLoading(true);
        onNext().finally(() => setLoading(false));
    }

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">Carga de PDF</h2>
            <p className="text-gray-600">Sube un archivo PDF para procesar sus instrumentos.</p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                    Arrastra y suelta tu archivo PDF aquí, o
                </p>
                <Label
                    htmlFor="file-upload"
                    className="mt-2 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
                >
                    Seleccionar archivo
                    <Input
                        id="file-upload"
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={loading}
                    />
                </Label>
            </div>
            {file && <p className="mt-2 text-sm text-gray-600">Archivo seleccionado: <strong>{file.name}</strong></p>}
            <Button
                className="w-full mt-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-300"
                disabled={!file || loading}
                onClick={handleOnNext}
            >
                {
                    loading ?

                        <ClipLoader
                            loading
                            size={20}
                            speedMultiplier={1}
                            color="#ffffff"
                        />
                        :
                        <>
                            Siguiente paso
                            <ChevronRightIcon className="h-4 w-4" />
                        </>
                }

            </Button>
        </div>
    );
}

/** Step 2: Error Display Component */
function StepErrorReview({
    data,
    errors,
    onBack,
    onNext
}: {
    data: InstrumentPDFDTO[];
    errors: { juzgadoErrors: InstrumentPDFDTO[]; typeErrors: InstrumentPDFDTO[] };
    onBack: () => void;
    onNext: () => void;
}) {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">Datos procesados</h2>

            {errors.juzgadoErrors.length > 0 && (
                <ErrorList
                    title="Errores de juzgado"
                    errors={errors.juzgadoErrors.map(e => ({ message: "No se encontró el juzgado", caratula: e.caratula }))}
                />
            )}

            {errors.typeErrors.length > 0 && (
                <ErrorList
                    title="Errores de tipo de instrumento"
                    errors={errors.typeErrors.map(e => ({ message: "No se encontró el tipo de instrumento", caratula: e.caratula }))}
                />
            )}

            <div className="flex justify-between mt-6">
                <Button
                    className="bg-blue-500 hover:bg-blue-600"
                    onClick={onBack}
                >
                    <ChevronLeftIcon className="h-4 w-4" />
                    Volver
                </Button>
                <Button
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300"
                    disabled={errors.juzgadoErrors.length > 0 || errors.typeErrors.length > 0}
                    onClick={onNext}
                >
                    Siguiente paso
                    <ChevronRightIcon className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

/** Error List Component */
function ErrorList({ title, errors }: { title: string; errors: { caratula: string; message: string }[] }) {
    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-red-600">{title}</h3>
            <ul className="space-y-2">
                {errors.map((error, index) => (
                    <li key={index} className="flex flex-col bg-red-100 p-3 rounded-lg">
                        <div className="flex flex-row items-center gap-2">
                            <FileIcon className="h-5 w-5 text-red-500" />
                            <span className="text-sm text-gray-800 font-medium">{error.caratula}</span>
                        </div>
                        <span className="text-sm text-gray-600">Error: {error.message}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

/** Step 3: Paginated Data Review */
function StepDataReview({
    data,
    currentPage,
    totalPages,
    onNextPage,
    onPrevPage,
    onBack,
    onConfirm
}: {
    data: InstrumentPDFDTO[];
    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPrevPage: () => void;
    onBack: () => void;
    onConfirm: () => void;
}) {
    const paginatedData = data.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">Datos procesados</h2>
            <ul className="space-y-2">
                {paginatedData.map((item, index) => (
                    <li key={index} className="flex flex-col bg-gray-100 p-3 rounded-lg">
                        <div className="flex flex-row items-center gap-2">
                            <FileIcon className="h-5 w-5 text-blue-500" />
                            <span className="text-sm text-gray-800 font-medium">{item.caratula}</span>
                        </div>
                        <span className="text-sm text-gray-600">Organismo: {item.organismo}</span>
                        <span className="text-sm text-gray-600">Tramite: {item.tramite}</span>
                        <span className="text-sm text-gray-600">Fecha: {item.altaDisponibilidad}</span>
                    </li>
                ))}
            </ul>
            <div className="flex items-center justify-between mt-4">
                <Button variant="outline" onClick={onPrevPage} disabled={currentPage === 1}>
                    <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">Página {currentPage} de {totalPages}</span>
                <Button variant="outline" onClick={onNextPage} disabled={currentPage === totalPages}>
                    <ChevronRightIcon className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex justify-between mt-6">
                <Button className="bg-blue-500 hover:bg-blue-600" onClick={onBack}>
                    <ChevronLeftIcon className="h-4 w-4" />
                    Volver
                </Button>
                <Button className="bg-green-500 hover:bg-green-600" onClick={onConfirm}>
                    Confirmar carga
                    <ChevronRightIcon className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

/** Main Component */
export default function PDFUploadProcess() {
    const [step, setStep] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<InstrumentPDFDTO[]>([]);
    const [instrumentsWithJuzgadoError, setInstrumentsWithJuzgadoError] = useState<InstrumentPDFDTO[]>([]);
    const [instrumentsWithInstrumentTypeError, setInstrumentsWithInstrumentTypeError] = useState<InstrumentPDFDTO[]>([]);
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
