"use client";
import { parseDataToYear, parseDate } from "@/lib/utils";""
import { AgenteExtendidoDto } from "@/types/agenteTypes";
import SearchInput from "../shared/search";
import { AgenteCard } from "./agenteCard";
import { Button } from "../ui/button";
import { Plus } from "@mynaui/icons-react";

interface AgenteListProps {
    agentes: AgenteExtendidoDto[]
}


export default function ListAgentes({ agentes }: Readonly<AgenteListProps>) {
    return (
        <div className="flex flex-col gap-6 p-6  min-h-screen">
            <div className="flex flex-col gap-2 md:flex-row md:justify-between">
                <SearchInput placeholder="Buscar por nombre..."  />
                <Button
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white"
                onClick={() => console.log("Creando agente")} >
                    <span >Crear Agente</span>
                    <Plus  />
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agentes.map((agente) => (
                    <AgenteCard key={agente.id} agente={agente} onEdit={() => console.log("Editando agente")} onDelete={() => console.log("Eliminando agente")} />
                ))}
            </div>
        </div>
    );
}
    