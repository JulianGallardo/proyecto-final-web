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

const ITEMS_PER_PAGE = 10;

interface InstrumentDTO {
    organismo: string;
    caratula: string;
    numero: number;
    destinatario: string;
    domicilio: string;
    destinatarioPostal: string;
    altaDisponibilidad: string;
    notificacion: string;
    tramite: string;
    codigo: string;
    estado: string;
}

export default function PDFUploadProcess() {
    const [step, setStep] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<InstrumentDTO[]>([]);
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
            const parsedData = await extractTextFromPDFAndParse(file) as InstrumentDTO[];
            setData(parsedData);
            setStep(2);
        }
    };

    const confirmUpload = () => setStep(3);

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
                <Button variant="outline" className="flex flex-row w-fit  gap-2">
                    <Link href="/instrumentos" className="flex flex-row items-center gap-2 w-fit ">

                        <ChevronLeftIcon className="h-4 w-4" />
                        Volver al listado
                    </Link>
                </Button>

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

                        {step === 3 && (
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
                                    <Button
                                        variant="outline"
                                    >
                                        <Link href="/instrumentos">
                                            Volver al listado
                                        </Link>
                                    </Button>
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
