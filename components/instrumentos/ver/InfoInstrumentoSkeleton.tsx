import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FatCornerUpLeft } from "@mynaui/icons-react";

const InstrumentDetailSkeleton = () => {
    return (
        <Card className="w-full mx-auto mt-8">
            <CardHeader>
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-2xl font-bold">
                        <Skeleton className="h-8 w-64" />
                    </CardTitle>
                    <Button variant="secondary" size="sm">
                        <Skeleton className="h-4 w-10  md:w-28" />
                        <FatCornerUpLeft className="w-6 h-6 ml-2" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left column */}
                    <div className="space-y-4">
                        {/* Código */}
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <div>
                                <Skeleton className="h-4 w-16 mb-1" />
                                <Skeleton className="h-5 w-40" />
                            </div>
                        </div>

                        {/* Caratula */}
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <div>
                                <Skeleton className="h-4 w-20 mb-1" />
                                <Skeleton className="h-5 w-48" />
                            </div>
                        </div>

                        {/* Juzgado */}
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <div>
                                <Skeleton className="h-4 w-18 mb-1" />
                                <Skeleton className="h-5 w-36" />
                            </div>
                        </div>

                        {/* Juzgado y Nº de Orden */}
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <div>
                                <Skeleton className="h-4 w-32 mb-1" />
                                <Skeleton className="h-5 w-44" />
                            </div>
                        </div>

                        {/* Zona y Subzona */}
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <div>
                                <Skeleton className="h-4 w-28 mb-1" />
                                <Skeleton className="h-5 w-40" />
                            </div>
                        </div>

                        {/* Urgencia */}
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <div>
                                <Skeleton className="h-4 w-22 mb-1" />
                                <Skeleton className="h-5 w-32" />
                            </div>
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-4">
                        {/* Fecha de Ingreso */}
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <div>
                                <Skeleton className="h-4 w-30 mb-1" />
                                <Skeleton className="h-5 w-32" />
                            </div>
                        </div>

                        {/* Fecha de Descarga */}
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <div>
                                <Skeleton className="h-4 w-34 mb-1" />
                                <Skeleton className="h-5 w-32" />
                            </div>
                        </div>

                        {/* Tipo de Instrumento */}
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <div>
                                <Skeleton className="h-4 w-36 mb-1" />
                                <Skeleton className="h-5 w-36" />
                            </div>
                        </div>

                        {/* Domicilio denunciado */}
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <div>
                                <Skeleton className="h-4 w-38 mb-1" />
                                <Skeleton className="h-5 w-52" />
                            </div>
                        </div>

                        {/* Estado */}
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <div>
                                <Skeleton className="h-4 w-16 mb-1" />
                                <Skeleton className="h-6 w-24 rounded-full" />
                            </div>
                        </div>

                        {/* Correcciones */}
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <div>
                                <Skeleton className="h-4 w-24 mb-1" />
                                <Skeleton className="h-9 w-48 rounded-md" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Observaciones */}
                <div className="mt-6">
                    <div className="flex items-center space-x-2 mb-2">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-4 w-28" />
                    </div>
                    <Skeleton className="h-24 w-full rounded-lg" />
                </div>

                {/* Historial de Notificaciones */}
                <div className="mt-6">
                    <div className="flex items-center space-x-2 mb-2">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-4 w-48" />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="text-left">
                                        <Skeleton className="h-4 w-32" />
                                    </th>
                                    <th className="text-left">
                                        <Skeleton className="h-4 w-20" />
                                    </th>
                                    <th className="text-left">
                                        <Skeleton className="h-4 w-24" />
                                    </th>
                                    <th className="text-left">
                                        <Skeleton className="h-4 w-40" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3].map((item) => (
                                    <tr key={item}>
                                        <td>
                                            <Skeleton className="h-4 w-28 my-2" />
                                        </td>
                                        <td>
                                            <Skeleton className="h-6 w-20 rounded-full my-2" />
                                        </td>
                                        <td>
                                            <Skeleton className="h-4 w-24 my-2" />
                                        </td>
                                        <td>
                                            <Skeleton className="h-4 w-40 my-2" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default InstrumentDetailSkeleton;