import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ChevronRight } from 'lucide-react';
import { SadCircle } from '@mynaui/icons-react';

interface RoutePlannerProps {
    instrucciones: {
        segmento: string;
        instrucciones: string[];
    }[];
}

export default function Instrucciones({ instrucciones }: Readonly<RoutePlannerProps>) {
    return (
        <Card className="w-full h-full">
            <CardHeader>
                <CardTitle>Instrucciones</CardTitle>
            </CardHeader>
            <CardContent>


                {
                    instrucciones.length === 0 && (
                        <div className="flex flex-col items-center justify-center w-full h-32">
                            <SadCircle className="w-12 h-12 text-muted-foreground" />
                            <p className="text-muted-foreground">No hay instrucciones para mostrar.</p>
                        </div>
                    )
                }

                <div className="flex flex-col gap-6">
                    {instrucciones.map((instruccion, index) => (
                        <div key={index + instruccion.segmento}>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold">
                                    {index + 1}
                                </div>
                                <h3 className="text-lg font-semibold">{instruccion.segmento}</h3>
                            </div>

                            <div className="ml-10 space-y-3">
                                {instruccion.instrucciones.map((paso, idx) => (
                                    <div key={idx + paso} className="flex items-start gap-2">
                                        <ChevronRight className="w-4 h-4 mt-1 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">{paso}</p>
                                    </div>
                                ))}
                                {
                                    instruccion.instrucciones.length === 0 && (
                                        <p className="text-muted-foreground">No hay instrucciones para este segmento.</p>
                                    )
                                }
                            </div>

                            {index < instrucciones.length - 1 && (
                                <Separator className="mt-4" />
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}