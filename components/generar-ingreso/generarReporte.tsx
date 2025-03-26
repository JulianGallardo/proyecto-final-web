"use client";
import { AgenteExtendidoDto } from "@/types/agenteTypes";
import SeleccionarFechaAgente from "./seleccionarFechaAgente";
import { useEffect, useState } from "react";
import { getInstrumentosByAgent } from "@/actions/instrumentos-actions";
import { InstrumentoExtendido } from "@/types/instrumentoTypes";
import { TablaInstrumentosReporte } from "./tabla-instrumentos-reporte";
import DescargarExcelButton from "../instrumentos-agente/descargar-excel-button";
import { Loader2 } from "lucide-react";
import { InfoCircle } from "@mynaui/icons-react";

export default function GenerarReporte(
    {
        agentes
    }: Readonly<{
        agentes: AgenteExtendidoDto[]
    }>
) {
    const [agenteSeleccionado, setAgenteSeleccionado] = useState<AgenteExtendidoDto | null>(null);
    const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | undefined>(undefined);
    const [instrumentos, setInstrumentos] = useState<InstrumentoExtendido[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (agenteSeleccionado && fechaSeleccionada) {
            const fetchInstrumentos = async () => {
                setIsLoading(true);
                try {
                    const resultado = await getInstrumentosByAgent({
                        desde: fechaSeleccionada.toISOString().split('T')[0],
                        hasta: fechaSeleccionada.toISOString().split('T')[0],
                    }, agenteSeleccionado.id);
                    setInstrumentos(resultado);
                } catch (error) {
                    console.error("Error fetching instrumentos:", error);
                } finally {
                    setIsLoading(false);
                }
            }
            fetchInstrumentos();
        }
    }, [agenteSeleccionado, fechaSeleccionada])

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Generar Ingresos Diarios</h1>


            <SeleccionarFechaAgente
                agentes={agentes}
                onAgentSelect={setAgenteSeleccionado}
                onDateSelect={setFechaSeleccionada}
            />


            <div className="flex flex-col mt-4 items-start justify-start gap-2">
                {
                    !agenteSeleccionado || !fechaSeleccionada && (
                        <div className="flex flex-col w-full justify-center items-center h-64 bg-gray-100 rounded-lg">
                            <InfoCircle className="h-16 w-16 text-gray-400 mb-4" />
                            <p className="text-gray-500 text-lg font-semibold">Seleccione un agente y una fecha</p>
                            <p className="text-gray-400 text-sm">Para generar el reporte</p>
                        </div>
                    )
                }

                {isLoading &&
                    <div className="flex flex-col w-full justify-center items-center h-64 bg-gray-100 rounded-lg">
                        <Loader2 className="h-16 w-16 text-gray-400 mb-4 animate-spin" />
                        <p className="text-gray-500 text-lg font-semibold">Cargando...</p>
                    </div>
                }
                {
                    agenteSeleccionado && fechaSeleccionada && !isLoading &&
                    <>
                        {instrumentos.length > 0 && (
                            <div className="mt-4 flex justify-end">
                                <DescargarExcelButton
                                    searchParams={{
                                        desde: fechaSeleccionada.toISOString().split('T')[0],
                                        hasta: fechaSeleccionada.toISOString().split('T')[0]
                                    }}
                                    agenteId={agenteSeleccionado.id}
                                />
                            </div>
                        )}
                        <TablaInstrumentosReporte data={instrumentos} />


                    </>
                }
            </div>
        </div>

    )
}