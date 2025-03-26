"use client";
import { AgenteExtendidoDto } from "@/types/agenteTypes";
import SeleccionarFechaAgente from "./seleccionarFechaAgente";
import { useEffect, useState } from "react";
import { TablaInstrumentosAgente } from "../instrumentos-agente/tabla-instrumentos-agente";
import { getInstrumentosByAgent } from "@/actions/instrumentos-actions";
import { parseDataToYear } from "@/lib/utils";
import { InstrumentoExtendido } from "@/types/instrumentoTypes";

export default function GenerarReporte(
    {
        agentes
    }: Readonly<{
        agentes: AgenteExtendidoDto[]
    }>
){



    const [agenteSeleccionado, setAgenteSeleccionado] = useState<AgenteExtendidoDto | null>(null);
    const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | undefined>(undefined);
    const [instrumentos, setInstrumentos] = useState<InstrumentoExtendido[]>([]);

    useEffect(() => {
        if(agenteSeleccionado && fechaSeleccionada){
            const fetchInstrumentos = async () => {
                const resultado = await getInstrumentosByAgent({
                    desde: fechaSeleccionada.toISOString().split('T')[0],
                    hasta: fechaSeleccionada.toISOString().split('T')[0],
                }, agenteSeleccionado.id);
                setInstrumentos(resultado);
            }
            fetchInstrumentos();
        }
    }, [agenteSeleccionado, fechaSeleccionada])

    
    

    return (
        <div>
            <h1>Generar carpeta ingreso diarios</h1>
            <SeleccionarFechaAgente agentes={agentes} onAgentSelect={ setAgenteSeleccionado } onDateSelect={setFechaSeleccionada}/>
            <TablaInstrumentosAgente data={instrumentos} />
        </div>
    )
}