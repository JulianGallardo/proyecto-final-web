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
import { extractTextFromPDFAndParse } from "@/lib/readPdf";
import Link from "next/link";
import { createInstrumentoFromPDF, deleteDuplicatePdfEntries } from "@/actions/instrumentos-actions";
import { InstrumentPDFDTO } from "@/types/instrumento";
import { toast } from "@/hooks/use-toast";

const ITEMS_PER_PAGE = 10;



export default function PDFUploadProcess() {
    const [step, setStep] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<InstrumentPDFDTO[]>([]);
    const [instrumentsWithJuzgadoError, setInstrumentsWithJuzgadoError] = useState<InstrumentPDFDTO[]>([]);
    const [instrumentsWithInstrumentTypeError, setInstrumentsWithInstrumentTypeError] = useState<InstrumentPDFDTO[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
        } else {
            setFile(null);
            alert("Por favor, selecciona un archivo PDF válido.");
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (file) {
            try {
                const parsedData = await extractTextFromPDFAndParse(file) as InstrumentPDFDTO[];
                if (!parsedData) {
                    throw new Error("No se pudo extraer información del PDF");
                }
                const { filteredInstrument, instrumentsWithJuzgadoError, instrumentsWithInstrumentTypeError } = await deleteDuplicatePdfEntries(parsedData);


                if(instrumentsWithInstrumentTypeError.length === 0 && instrumentsWithJuzgadoError.length === 0){
                    setData(filteredInstrument);
                    setStep(3);
                    return;
                }
                

                setInstrumentsWithJuzgadoError(instrumentsWithJuzgadoError);
                setInstrumentsWithInstrumentTypeError(instrumentsWithInstrumentTypeError);
                setData(filteredInstrument);
                setStep(2);

            } catch (error) {
                toast({
                    title: "Error",
                    description: (error instanceof Error ? error.message : "Ha ocurrido un error al procesar el PDF"),
                    className: "bg-red-500 text-white",
                    duration: 3000,
                });
                return;
            }
        };
    };

    const confirmUpload = async () => {
        try {
            for (const element of data) {
                await createInstrumentoFromPDF(element);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: (error instanceof Error ? error.message : "Ha ocurrido un error al crear el instrumento"),
                className: "bg-red-500 text-white",
                duration: 3000,
            });
            return;
        }

        setStep(3);
    }

    const handleCancel = () => {
        setFile(null);
        setData([]);
        setStep(1);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    const paginatedData = data.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const goToNextPage = () =>
        setCurrentPage((page) => Math.min(page + 1, totalPages));
    const goToPreviousPage = () =>
        setCurrentPage((page) => Math.max(page - 1, 1));

    return (
        <div className="flex flex-col items-center w-full h-full py-4 gap-2 px-2 overflow-x-hidden">
            <div className="flex flex-col  gap-4 w-full max-w-3xl">
                <Link href="/instrumentos" className="flex flex-row items-center gap-2 w-fit ">
                    <Button variant="outline" className="flex flex-row w-fit  gap-2">
                        <ChevronLeftIcon className="h-4 w-4" />
                        Volver al listado
                    </Button>
                </Link>

                <Card className="w-full max-w-3xl shadow-md">

                    <CardContent className="p-8">
                        {step === 1 && (

                            <div className="flex flex-col gap-4">
                                <h2 className="text-2xl font-semibold text-gray-800">Carga de PDF</h2>
                                <p className="text-gray-600">
                                    Sube un archivo PDF para procesar sus instrumentos.
                                </p>
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
                                        />
                                    </Label>
                                </div>
                                {file && (
                                    <p className="mt-2 text-sm text-gray-600">
                                        Archivo seleccionado: <strong>{file.name}</strong>
                                    </p>
                                )}

                                <Button
                                    className="w-full mt-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-300"
                                    disabled={!file}
                                    onClick={handleSubmit as any}
                                >
                                    Siguiente paso
                                    <ChevronRightIcon className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                        {step === 2 && (

                            <div className="flex flex-col gap-4">
                                <h2 className="text-2xl font-semibold text-gray-800">
                                    Datos procesados
                                </h2>

                                {instrumentsWithJuzgadoError.length > 0 && (
                                    <div className="flex flex-col gap-4">
                                        <h3 className="text-lg font-semibold text-red-600">Errores de juzgado</h3>
                                        <ul className="space-y-2">
                                            {instrumentsWithJuzgadoError.map((item, index) => (
                                                <li
                                                    key={index}
                                                    className="flex flex-col  bg-red-100 p-3 rounded-lg"
                                                >
                                                    <div className="flex flex-row items-center gap-2">
                                                        <FileIcon className="h-5 w-5 text-red-500" />
                                                        <span className="text-sm text-gray-800 font-medium">
                                                            {item.caratula}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm text-gray-600">
                                                        Error: No se encontro el juzgado
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {instrumentsWithInstrumentTypeError.length > 0 && (
                                    <div className="flex flex-col gap-4">
                                        <h3 className="text-lg font-semibold text-red-600">Errores de tipo de instrumento</h3>
                                        <ul className="space-y-2">
                                            {instrumentsWithInstrumentTypeError.map((item, index) => (
                                                <li
                                                    key={index}
                                                    className="flex flex-col  bg-red-100 p-3 rounded-lg"
                                                >
                                                    <div className="flex flex-row items-center gap-2">
                                                        <FileIcon className="h-5 w-5 text-red-500" />
                                                        <span className="text-sm text-gray-800 font-medium">
                                                            {item.caratula}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm text-gray-600">
                                                        Error: No se encontro el tipo de instrumento
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}


                                <div className="flex justify-between mt-6">
                                    <Button
                                        className=" mt-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300"
                                        onClick={() => setStep(1)}
                                    >

                                        <ChevronLeftIcon className="h-4 w-4" />
                                        Volver
                                    </Button>
                                    <Button
                                        className=" mt-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-300"
                                        disabled={!file}
                                        onClick={handleSubmit as any}
                                    >
                                        Siguiente paso
                                        <ChevronRightIcon className="h-4 w-4" />
                                    </Button>
                                </div>




                            </div>
                        )}

                        {step === 3 && (
                            <div className="flex flex-col gap-4">
                                <h2 className="text-2xl font-semibold text-gray-800">
                                    Datos procesados
                                </h2>
                                <ul className="space-y-2">
                                    {paginatedData.map((item, index) => (
                                        <li
                                            key={index}
                                            className="flex flex-col  bg-gray-100 p-3 rounded-lg"
                                        >
                                            <div className="flex flex-row items-center gap-2">
                                                <FileIcon className="h-5 w-5 text-blue-500" />
                                                <span className="text-sm text-gray-800 font-medium">
                                                    {item.caratula}
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-600">
                                                Organismo:{item.organismo}
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                Tramite: {item.tramite}
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                Fecha: {item.altaDisponibilidad}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex items-center justify-between mt-4">
                                    <Button
                                        variant="outline"
                                        onClick={goToPreviousPage}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeftIcon className="h-4 w-4" />
                                    </Button>
                                    <span className="text-sm text-gray-600">
                                        Página {currentPage} de {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        onClick={goToNextPage}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronRightIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex justify-between mt-6">
                                    <Button className=" bg-blue-500 hover:bg-blue-600" onClick={() => setStep(1)}>
                                        <ChevronLeftIcon className="h-4 w-4" />
                                        Volver
                                    </Button>
                                    <Button className=" bg-green-500 hover:bg-green-600" onClick={confirmUpload}>
                                        Confirmar carga
                                        <ChevronRightIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="flex flex-col gap-2 text-center items-center justify-center w-full h-full">
                                <CheckIcon className="h-12 w-12 text-green-500" />
                                <h2 className=" text-2xl font-semibold text-gray-800">
                                    ¡Carga confirmada!
                                </h2>
                                <p className=" text-gray-600">
                                    Tus datos han sido procesados correctamente.
                                </p>
                                <div className="flex flex-row items-center justify-center gap-4 ">
                                    <Button onClick={handleCancel}>
                                        Cargar otro archivo
                                    </Button>
                                    <Link href="/instrumentos">
                                        <Button
                                            variant="outline"
                                        >

                                            Volver al listado

                                        </Button>
                                    </Link>
                                </div>


                            </div>
                        )}
                    </CardContent>
                </Card>
                <div />
            </div>
        </div>
    );
}
