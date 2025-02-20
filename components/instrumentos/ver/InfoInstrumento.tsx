"use client";

import { getInstrumentoByCode } from "@/actions/instrumentos-actions";
import { getEntregasStatusColor, getInstrumentosStatusColor, parseDate } from "@/lib/utils";
import { InstrumentoExtendidoConEntregas } from "@/types/instrumentoTypes";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollText, Calendar, User, Scale, FileText, AlertCircle, Info, MapIcon } from "lucide-react";
import { FatCornerUpLeft, SadCircle } from "@mynaui/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function InfoInstrumento() {
    const pathname = usePathname();
    const codigoInstrumento = pathname.split("/").pop();
    const [instrumento, setInstrumento] = useState<InstrumentoExtendidoConEntregas | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        startTransition(async () => {
            if (!codigoInstrumento) return;
            setIsLoading(true);
            const instrumento = await getInstrumentoByCode(codigoInstrumento);
            setInstrumento(instrumento);
            setIsLoading(false);
        });
    }, [codigoInstrumento]);





    if (isLoading || isPending) {
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

    if (!instrumento && !isLoading && !isPending) {
        return (
            <Card className="w-full max-w-3xl mx-auto mt-8">
                <CardContent className="flex flex-col items-center justify-center  py-6">
                    <SadCircle className="h-12 w-12 text-muted-foreground mx-auto" />
                    <h2 className="text-xl font-bold text-center text-muted-foreground">Instrumento no encontrado</h2>
                    <p className="text-sm text-muted-foreground text-center ">
                        No se ha encontrado un instrumento con el código {codigoInstrumento}
                    </p>
                    <Link href={`/instrumentos`}>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="mt-4"

                        >
                            <span className="">Volver al listado</span>
                            <FatCornerUpLeft className="w-6 h-6" />

                        </Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    if (instrumento)
        return (
            <Card className="w-full mx-auto mt-8">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold">
                            Información del Instrumento
                        </CardTitle>
                        <Link href={`/instrumentos`}>
                            <Button
                                variant="secondary"
                                size="sm"
                            >
                                <span className="">Volver al listado</span>
                                <FatCornerUpLeft className="w-6 h-6" />

                            </Button>
                        </Link>
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
                                    <p className="text-sm text-muted-foreground">Zona y Subzona</p>
                                    <p className="font-medium">{instrumento.zoneName ? instrumento.zoneName : "Sin Zona"} - {instrumento.subZona}</p>
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
                                            ? parseDate(instrumento.fecha_de_salida.toISOString())
                                            : "Sin fecha"}
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

                    <div className="mt-6">
                        <div className="flex items-center space-x-2 mb-2">
                            <AlertCircle className="h-5 w-5 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Historial de Notificaciones</p>
                        </div>

                        {instrumento.HistorialEntregas.length > 0 ? (
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
                                            <tr key={entrega.agente.user.name + index}>
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
                        ) : (
                            <Card className="bg-muted">
                                <CardContent className="flex flex-col items-center justify-center py-6">
                                    <SadCircle className="h-12 w-12 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground mt-4 text-center">
                                        Todavía no se realizaron notificaciones para este instrumento
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
}