"use client";

import { getInstrumentoByCode } from "@/actions/instrumentos-actions";
import { parseDate } from "@/lib/utils";
import {  InstrumentoExtendidoConEntregas } from "@/types/instrumentoTypes";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollText, Calendar, User, Scale, FileText, AlertCircle, Info, MapIcon } from "lucide-react";
import { EstadoEntrega, EstadoInstrumento } from "@prisma/client";
import { SadCircle } from "@mynaui/icons-react";

export default function InfoInstrumento() {
    const pathname = usePathname();
    const codigoInstrumento = pathname.split("/").pop();
    const [instrumento, setInstrumento] = useState<InstrumentoExtendidoConEntregas | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        startTransition(async () => {
            if (!codigoInstrumento) return;
            const instrumento = await getInstrumentoByCode(codigoInstrumento);
            
            setInstrumento(instrumento);
        });
    }, [codigoInstrumento]);

    const getInstrumentosStatusColor = (estado: EstadoInstrumento) => {
        switch (estado) {
            case EstadoInstrumento.PENDIENTE_DE_PROCESAR:
                return 'bg-blue-100 text-blue-800 border-blue-500 hover:bg-blue-400';
            case EstadoInstrumento.ENTREGADO_VERDE:
                return 'bg-green-100 text-green-800 border-green-500 hover:bg-green-400';
            case EstadoInstrumento.ENTREGADO_AMARILLO:
                return 'bg-yellow-100 text-yellow-800 border-yellow-500 hover:bg-yellow-400';
            case EstadoInstrumento.ENTREGADO_ROJO:
                return 'bg-red-100 text-red-800 border-red-500 hover:bg-red-400';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-500';
        }
    };
    const getEntregasStatusColor = (estado: EstadoEntrega) => {
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

    if (isPending) {
        return (
            <Card className="w-full mx-auto mt-8">
                <CardHeader>
                    <CardTitle>Cargando información del instrumento...</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-8 w-full" />
                    ))}
                </CardContent>
            </Card>
        );
    }

    if (!instrumento && !isPending) {
        return (
            <Card className="w-full mx-auto mt-8">
                <CardHeader>
                    <CardTitle>Instrumento no encontrado</CardTitle>
                </CardHeader>
                <CardContent>
                    <SadCircle className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">
                        No se ha encontrado un instrumento con el código {codigoInstrumento}
                    </p>
                </CardContent>
            </Card>
        );
    }

    if (instrumento)
        return (
            <Card className="w-full  mx-auto mt-8">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold">
                            Información del Instrumento
                        </CardTitle>

                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <ScrollText className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Código</p>
                                    <p className="font-medium">{instrumento.cargaInstrumento} - {instrumento.codigoInstrumento}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <User className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Caratula</p>
                                    <p className="font-medium">{instrumento.caratula}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Scale className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Juzgado</p>
                                    <p className="font-medium">{instrumento.orden.juzgado.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Scale className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Juzgado y Nº de Orden</p>
                                    <p className="font-medium">{instrumento.orden.juzgado.identifier} - {instrumento.orden.ordenNumber}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <MapIcon className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Zona</p>
                                    <p className="font-medium">{instrumento.zoneName ? instrumento.zoneName : "Sin Zona"}</p>
                                </div>
                            </div>




                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Fecha de Ingreso</p>
                                    <p className="font-medium">{parseDate(instrumento.fecha_de_ingreso.toISOString())}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Fecha de Descarga</p>
                                    <p className="font-medium">
                                        {instrumento.fecha_de_salida
                                            ? parseDate(instrumento.fecha_de_salida.toISOString()) : "Sin fecha"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Tipo de Instrumento</p>
                                    <p className="font-medium">{instrumento.instrumentoType.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Domicilio denunciado</p>
                                    <p className="font-medium">{instrumento.domicilio_denunciado}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Info className="h-5 w-5 text-muted-foreground" />
                                <div>

                                    <p className="text-sm text-muted-foreground">Estado</p>
                                    <Badge className={getInstrumentosStatusColor(instrumento.estado)}>
                                        {instrumento.estado.replace(/_/g, ' ')}
                                    </Badge>
                                </div>

                            </div>

                        </div>
                    </div>

                    {instrumento.observaciones && (
                        <div className="mt-6">
                            <div className="flex items-center space-x-2 mb-2">
                                <AlertCircle className="h-5 w-5 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Observaciones</p>
                            </div>
                            <p className="text-sm bg-muted p-4 rounded-lg">
                                {instrumento.observaciones}
                            </p>
                        </div>
                    )}

                    {
                        instrumento.HistorialEntregas.length > 0 && (
                            <div className="mt-6">
                                <div className="flex items-center space-x-2 mb-2">
                                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">Historial de Entregas</p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr>
                                                <th className="text-left">Fecha de Entrega</th>
                                                <th className="text-left">Estado</th>
                                                <th className="text-left">Agente</th>
                                                <th className="text-left">Observaciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {instrumento.HistorialEntregas.map((entrega, index) => (
                                                <tr key={index}>
                                                    <td>{parseDate(entrega.fecha_entrega.toISOString())}</td>
                                                    <td>
                                                        <Badge className={getEntregasStatusColor(entrega.estado)}>
                                                            {entrega.estado.replace(/_/g, ' ')}
                                                        </Badge>
                                                    </td>
                                                    <td>{entrega.agente.user.name} {entrega.agente.user.lastname}</td>
                                                    <td>{entrega.observaciones}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )
                    }


                </CardContent>
            </Card>
        );
}