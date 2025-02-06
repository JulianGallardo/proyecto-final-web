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


export default function EntregasRepartidor({ agenteId }: Readonly<{ agenteId: number }>) {
    const [totalPages, setTotalPages] = useState<number>(0);
    const [entregas, setEntregas] = useState<EntregaInstrumentosDto[]>([]);
    const { toast } = useToast();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;


    const handleDateSelect = async (selectedDate: Date | undefined) => {
        if (!selectedDate || selectedDate.toString() === "Invalid Date")
            return toast({
                title: "Error",
                description: "Seleccione una fecha.",
                variant: "destructive",
            });

        if (selectedDate) {
            setSelectedDate(selectedDate);
            try {
                const entregas = await getEntregasPaginated(currentPage, agenteId, selectedDate);
                const totalPages = await getTotalPages(agenteId, selectedDate);
                console.log(entregas);
                setTotalPages(totalPages);
                setEntregas(entregas);
            } catch (error) {
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
                        onChange={(e) => handleDateSelect(new Date(e.target.value))}
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
                                <p className="text-sm text-gray-400 font-semibold">Entregas para el {selectedDate.toLocaleDateString()}</p>
                                {entregas.length > 0 ? (
                                    <div className="flex items-center justify-between">
                                        <ul className="space-y-3">
                                            {entregas.map((entrega) => (
                                                <li key={entrega.id} className="p-4 bg-white shadow-sm rounded-lg border-l-4 border-blue-500">
                                                    <p className="text-sm font-medium text-gray-700">
                                                        <strong>Carátula:</strong> {entrega.instrumento.caratula}
                                                    </p>

                                                    <p className="text-sm font-medium text-gray-700">
                                                        <strong>Fecha de salida:</strong> {new Date(entrega.createdAt).toLocaleString()}
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
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