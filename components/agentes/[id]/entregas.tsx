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
import { parseDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { EstadoEntrega } from "@prisma/client";


export default function EntregasRepartidor({ agenteId }: Readonly<{ agenteId: number }>) {
    const [totalPages, setTotalPages] = useState<number>(0);
    const [entregas, setEntregas] = useState<EntregaInstrumentosDto[]>([]);
    const { toast } = useToast();
    const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;


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

const getStatusColor = (estado: EstadoEntrega) => {
    switch (estado) {
        case EstadoEntrega.PENDIENTE_DE_PROCESAR:
            return 'bg-yellow-100 text-yellow-800 border-yellow-500 hover:bg-yellow-400';
        case EstadoEntrega.ENTREGADO:
            return 'bg-green-100 text-green-800 border-green-500 hover:bg-green-400';
        case EstadoEntrega.NO_ENTREGADO:
            return 'bg-red-100 text-red-800 border-red-500 hover:bg-red-400';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-500';
    }
};

function EntregasList({ entregas }: Readonly<{ entregas: EntregaInstrumentosDto[] }>) {
    return (
        <div className="space-y-3">
            {entregas.map((entrega) => {
                const statusColor = getStatusColor(entrega.estado);

                return (
                    <Card
                        key={entrega.id}
                        className={`border-l-4 ${statusColor.split(' ')[2]} hover:shadow-md transition-shadow`}
                    >
                        <CardHeader className="pb-2">
                            <div className="flex flex-col md:flex-row gap-2 items-center justify-between">
                                <CardTitle className="text-lg">
                                    {entrega.instrumento.caratula}
                                </CardTitle>
                                <Badge className={statusColor}>
                                    {entrega.estado.replace(/_/g, ' ')}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Domicilio:</span>
                                {entrega.instrumento.domicilio_denunciado}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Instrumento:</span>
                                {entrega.instrumento.instrumentoType.name}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Código:</span>
                                {entrega.instrumento.cargaInstrumento} - {entrega.instrumento.codigoInstrumento}
                            </div>
                        
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Orden:</span>
                                {entrega.instrumento.orden.ordenNumber}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Juzgado:</span>
                                {entrega.instrumento.orden.juzgado.name}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Fecha:</span>
                                {new Date(entrega.fecha_entrega).toLocaleString()}
                            </div>
                            {entrega.observaciones && (
                                <div className="col-span-full mt-2">
                                    <span className="font-medium">Observaciones:</span>
                                    <p className="mt-1 text-gray-500">{entrega.observaciones}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
