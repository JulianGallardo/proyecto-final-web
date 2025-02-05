"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { SearchX } from "@mynaui/icons-react";

interface Entrega {
    id: number;
    instrumentoId: number;
    caratula: string;
    destinatario: string;
    domicilio_denunciado: string;
    fecha_de_salida: string;
}

export default function EntregasRepartidor({ agenteId }: Readonly<{ agenteId: number }>) {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [entregas, setEntregas] = useState<Entrega[]>([]);
    const { toast } = useToast();

    const handleDateSelect = async (selectedDate: Date | undefined) => {
        console.log(selectedDate);
        if (!selectedDate || selectedDate.toString() === "Invalid Date")
            return toast({
                title: "Error",
                description: "Seleccione una fecha.",
                variant: "destructive",
            });

        if (selectedDate) {
            setDate(selectedDate);
            try {
                const entregas = [
                    {
                        id: 1,
                        instrumentoId: 1,
                        caratula: "Carátula 1",
                        destinatario: "Destinatario 1",
                        domicilio_denunciado: "Domicilio 1",
                        fecha_de_salida: new Date().toISOString(),
                    },
                    {
                        id: 2,
                        instrumentoId: 2,
                        caratula: "Carátula 2",
                        destinatario: "Destinatario 2",
                        domicilio_denunciado: "Domicilio 2",
                        fecha_de_salida: new Date().toISOString(),
                    },
                ];
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

                    {entregas.length > 0 ? (
                        <ul className="space-y-3">
                            {entregas.map((entrega) => (
                                <li key={entrega.id} className="p-4 bg-white shadow-sm rounded-lg border-l-4 border-blue-500">
                                    <p className="text-sm font-medium text-gray-700">
                                        <strong>Carátula:</strong> {entrega.caratula}
                                    </p>
                                    <p className="text-sm font-medium text-gray-700">
                                        <strong>Destinatario:</strong> {entrega.destinatario}
                                    </p>
                                    <p className="text-sm font-medium text-gray-700">
                                        <strong>Domicilio:</strong> {entrega.domicilio_denunciado}
                                    </p>
                                    <p className="text-sm font-medium text-gray-700">
                                        <strong>Fecha de salida:</strong> {new Date(entrega.fecha_de_salida).toLocaleString()}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center space-y-2">
                            <SearchX className="w-12 h-12 text-gray-400 mx-auto" />
                            <p className="text-sm text-gray-400 font-semibold">No hay entregas para la fecha seleccionada.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}