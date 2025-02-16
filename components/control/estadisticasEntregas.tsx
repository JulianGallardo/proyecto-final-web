import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { getInstrumentosPorEstado } from "@/actions/estadisticas-actions";

const estadoColores = {
    PENDIENTE_DE_ENTREGA: "bg-gray-500",
    PENDIENTE_DE_PROCESAR: "bg-blue-500",
    ENTREGADO_VERDE: "bg-green-500",
    ENTREGADO_AMARILLO: "bg-yellow-500",
    ENTREGADO_ROJO: "bg-red-500"
};

const InstrumentosPorEstado = () => {
    const [instrumentos, setInstrumentos] = useState<Record<string, number>>({});

    useEffect(() => {
        const fetchInstrumentos = async () => {
            const instrumentos = await getInstrumentosPorEstado();
            setInstrumentos(instrumentos);
        };
        fetchInstrumentos();
    }, []);


    function getTextoEstado(estado: string) {
        switch (estado) {
            case "PENDIENTE_DE_ENTREGA":
                return "Pendiente de entrega";
            case "PENDIENTE_DE_PROCESAR":
                return "Pendiente de procesar la entrega";
            case "ENTREGADO_VERDE":
                return "Entregado en menos de una semana";
            case "ENTREGADO_AMARILLO":
                return "Entregado en menos de 2 semanas";
            case "ENTREGADO_ROJO":
                return "Entregado en mas de 2 semanas";
            default:
                return estado;
        }
    }

    return (
        <div className="flex flex-col w-full gap-2">
            {Object.entries(instrumentos).map(([estado, count]) => (
                <Card key={estado} className={`p-4 text-white ${estadoColores[estado as keyof typeof estadoColores]}`}> 
                    <h3 className="text-lg font-bold">{getTextoEstado(estado)}</h3>
                    <p className="text-2xl">{count}</p>
                </Card>
            ))}
        </div>
    );
};

export default InstrumentosPorEstado;
