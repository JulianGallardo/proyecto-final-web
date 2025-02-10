"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { SearchX } from "@mynaui/icons-react";
import { getEntregasPaginated, getTotalPages } from "@/actions/entrega-instrumentos-actions";
import { EntregaInstrumentosDto } from "@/types/entregasType";
import PaginationInstruments from "@/components/instrumentos/Tabla/Pagination";
import { useSearchParams } from "next/navigation";
import {  parseDate } from "@/lib/utils";


export default function EntregasRepartidor({ agenteId }: Readonly<{ agenteId: number }>) {
    const [totalPages, setTotalPages] = useState<number>(0);
    const [entregas, setEntregas] = useState<EntregaInstrumentosDto[]>([]);
    const { toast } = useToast();
    const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;


    const handleDateSelect = async (selectedDate: string ) => {
        const newDate = new Date(selectedDate);
        if (!newDate || newDate.toString() === "Invalid Date")
            return toast({
                title: "Error",
                description: "Seleccione una fecha.",
                variant: "destructive",
            });


        if (newDate) {
            setSelectedDate(selectedDate);
            try {
                const entregas = await getEntregasPaginated(currentPage, agenteId, selectedDate);
                const totalPages = await getTotalPages(agenteId, selectedDate);
                setTotalPages(totalPages);
                setEntregas(entregas);
            } catch (error) {
                console.error(error);
                toast({
                    title: "Error",
                    description: "No se pudieron cargar las entregas.",
                    variant: "destructive",
                });
            }
        }
    };

    return (
        <div className="p-2 space-y-2 w-full ">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Seleccionar Fecha</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col space-y-4">
                    <Input
                        type="date"
                        className="w-full p-2 rounded-md"
                        onChange={(e) => handleDateSelect(e.target.value)}
                    />

                    {
                        !selectedDate ? (
                            <div className="flex flex-col items-center space-y-2">
                                <SearchX className="w-12 h-12 text-gray-400 mx-auto" />
                                <p className="text-sm text-gray-400 font-semibold">Seleccione una fecha para ver las entregas.</p>
                            </div>
                        ) : null
                    }

                    {
                        selectedDate && (
                            <div className="flex flex-col items-center space-y-2">
                                <p className="text-sm text-gray-400 font-semibold">Entregas para el {parseDate(selectedDate)}</p>
                                {entregas.length > 0 ? (
                                    <div className="flex flex-col space-y-4 w-full">
                                        <EntregasList entregas={entregas} />
                                        <PaginationInstruments totalPages={totalPages} />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center space-y-2">
                                        <SearchX className="w-12 h-12 text-gray-400 mx-auto" />
                                        <p className="text-sm text-gray-400 font-semibold">No hay entregas para la fecha seleccionada.</p>
                                    </div>
                                )}
                            </div>
                        )
                    }


                </CardContent>
            </Card>
        </div>
    );
}

function EntregasList({ entregas }: Readonly<{ entregas: EntregaInstrumentosDto[] }>) {
    return (
        <div className="space-y-4">
            {entregas.map((entrega) => (
                <Card key={entrega.id} className="border-l-4 border-blue-500">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">
                            {entrega.instrumento.caratula}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-gray-700">
                        <p>
                            <strong>Domicilio:</strong> {entrega.instrumento.domicilio_denunciado}
                        </p>
                        <p>
                            <strong>Instrumento:</strong> {entrega.instrumento.instrumentoType.name}
                        </p>
                        <p>
                            <strong>Orden:</strong> {entrega.instrumento.orden.ordenNumber}
                        </p>
                        <p>
                            <strong>Juzgado:</strong> {entrega.instrumento.orden.juzgado.name}
                        </p>
                        <p>
                            <strong>Fecha de entrega:</strong> {new Date(entrega.createdAt).toLocaleString()}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
