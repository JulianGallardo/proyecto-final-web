"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { SearchX } from "@mynaui/icons-react";
import { getEntregasPaginated, getTotalPages } from "@/actions/entrega-instrumentos-actions";
import { EntregaInstrumentosDto } from "@/types/entregasType";
import PaginationInstruments from "@/components/instrumentos/Tabla/Pagination";
import { useSearchParams } from "next/navigation";
import { parseDate } from "@/lib/utils";
import EntregasList from "./entregasList";
import { Session } from "next-auth";


interface EntregasRepartidorProps {
    agenteId: number;
    user: Session;
}


export default function EntregasRepartidor({ agenteId, user }: Readonly<EntregasRepartidorProps>) {
    const [totalPages, setTotalPages] = useState<number>(0);
    const [entregas, setEntregas] = useState<EntregaInstrumentosDto[]>([]);
    const { toast } = useToast();
    const [selectedDate, setSelectedDate] = useState<string | undefined>( new Date().toISOString().split('T')[0]);
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    useEffect(() => {
        if (selectedDate) {
            getEntregasPaginated(currentPage, agenteId, selectedDate)
                .then((entregas) => {
                    setEntregas(entregas);
                })
                .catch((error) => {
                    console.error(error);
                    toast({
                        title: "Error",
                        description: "No se pudieron cargar las entregas.",
                        variant: "destructive",
                    });
                });
        }
    }, [selectedDate, currentPage]);

    const handleDateSelect = async (selectedDate: string) => {
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

