"use client";
import { parseDataToYear, parseDate } from "@/lib/utils";""
import { AgenteExtendidoDto } from "@/types/agenteTypes";
import SearchInput from "../shared/search";
import { AgenteCard } from "./agenteCard";

interface AgenteListProps {
    agentes: AgenteExtendidoDto[]
}


export default function ListAgentes({ agentes }: Readonly<AgenteListProps>) {
    return (
        <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-screen">
            <div className="bg-white p-4 rounded-lg shadow-md">
                <SearchInput placeholder="Buscar por nombre..."  />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agentes.map((agente) => (
                    <AgenteCard key={agente.id} agente={agente} onEdit={() => console.log("Editando agente")} onDelete={() => console.log("Eliminando agente")} />
                ))}
            </div>
        </div>
    );
}
    