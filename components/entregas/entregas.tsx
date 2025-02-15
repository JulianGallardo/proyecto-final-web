"use client";

import { useEffect, useState, useTransition } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";

interface EntregasRepartidorProps {
    agenteId: number;
    user: Session;
}




export function EntregaCardSkeleton() {
    return (
        <Card className="border-l-4 border-l-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row gap-2 items-center justify-between">
                    {/* Title skeleton */}
                    <Skeleton className="h-6 w-48" />
                    {/* Badge skeleton */}
                    <Skeleton className="h-5 w-32" />
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* Info rows */}
                {[...Array(6)].map((_, index) => (
                    <div key={index} className="flex items-center gap-2">

                        <Skeleton className="h-4 flex-1" />
                    </div>
                ))}

                {/* Observaciones skeleton - full width */}
                <div className="col-span-full mt-2">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-16 w-full" />
                </div>

            </CardContent>
        </Card>
    );
}

function EntregasSkeleton() {
    return (
        <div className="space-y-4 w-full">
            {[...Array(3)].map((_, i) => (
                <EntregaCardSkeleton key={i} />
            ))}
        </div>
    );
}

export default function EntregasRepartidor({ agenteId, user }: Readonly<EntregasRepartidorProps>) {
    const [totalPages, setTotalPages] = useState<number>(0);
    const [entregas, setEntregas] = useState<EntregaInstrumentosDto[]>([]);
    const { toast } = useToast();
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;
    const [isPending, startTransition] = useTransition();
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const fetchEntregas = async (date: string, page: number) => {
        try {
            const [entregasData, totalPagesData] = await Promise.all([
                getEntregasPaginated(page, agenteId, date),
                getTotalPages(agenteId, date)
            ]);

            setEntregas(entregasData);
            setTotalPages(totalPagesData);
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "No se pudieron cargar las entregas.",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        if (selectedDate) {
            fetchEntregas(selectedDate, currentPage).finally(() => {
                setIsInitialLoading(false);
            });
        }
    }, [currentPage]);

    const handleDateSelect = (newDate: string) => {
        const date = new Date(newDate);
        if (!date || date.toString() === "Invalid Date") {
            toast({
                title: "Error",
                description: "Seleccione una fecha válida.",
                variant: "destructive",
            });
            return;
        }

        startTransition(() => {
            setSelectedDate(newDate);
            fetchEntregas(newDate, currentPage);
        });
    };

    return (
        <div className="p-2 space-y-2 w-full">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Seleccionar Fecha</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col space-y-4">
                    <Input
                        type="date"
                        defaultValue={selectedDate}
                        className="w-full p-2 rounded-md"
                        onChange={(e) => handleDateSelect(e.target.value)}
                        disabled={isPending}
                    />

                    {isInitialLoading ? (
                        <EntregasSkeleton />
                    ) : (
                        <>
                            {!selectedDate && (
                                <div className="flex flex-col items-center space-y-2">
                                    <SearchX className="w-12 h-12 text-gray-400 mx-auto" />
                                    <p className="text-sm text-gray-400 font-semibold">
                                        Seleccione una fecha para ver las entregas.
                                    </p>
                                </div>
                            )}

                            {selectedDate && !isPending && (
                                <div className="flex flex-col items-center space-y-2">
                                    <p className="text-sm text-gray-400 font-semibold">
                                        Entregas para el {parseDate(selectedDate)}
                                    </p>
                                    {entregas.length > 0 ? (
                                        <div className="flex flex-col space-y-4 w-full">
                                            <EntregasList entregas={entregas} />
                                            <PaginationInstruments totalPages={totalPages} />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center space-y-2">
                                            <SearchX className="w-12 h-12 text-gray-400 mx-auto" />
                                            <p className="text-sm text-gray-400 font-semibold">
                                                No hay entregas para la fecha seleccionada.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {isPending && (
                                <EntregasSkeleton />
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}