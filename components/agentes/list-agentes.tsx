"use client";
import { parseDataToYear, parseDate } from "@/lib/utils"; ""
import { AgenteExtendidoDto, CreateAgenteDTO } from "@/types/agenteTypes";
import SearchInput from "../shared/search";
import { AgenteCard } from "./agenteCard";
import { Button } from "../ui/button";
import { Plus } from "@mynaui/icons-react";
import { useCustomDialog } from "@/hooks/useCustomDialog";
import CustomDialog from "../instrumentos/Dialogs/dialog";
import { FormularioNuevoAgente } from "./Forms/addNewAgenteForm";
import { createAgente } from "@/actions/agente-actions";
import { toast } from "@/hooks/use-toast";
import PaginationInstruments from "../instrumentos/Tabla/Pagination";
import { Map } from "lucide-react";
import Link from "next/link";

interface AgenteListProps {
    agentes: AgenteExtendidoDto[]
    totalPages: number
}


export default function ListAgentes({ agentes, totalPages }: Readonly<AgenteListProps>) {

    const { setIsOpen } = useCustomDialog();

    const handleNewAgente = () => {
        setIsOpen(true);
    }

    const handleCreateNewAgente = async (data: CreateAgenteDTO) => {
        try {
            const agente = await createAgente(data);
            if (agente) {
                toast({
                    title: "Agente registrado",
                    description: "El agente ha sido registrado con éxito.",
                    className: "bg-green-500 text-white",
                    duration: 3000,
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Ha ocurrido un error al registrar el nuevo agente.",
                className: "bg-red-500 text-white",
                duration: 3000,
            });
        }

        setIsOpen(false);
    }




    return (
        <div className="flex flex-col gap-6 p-6  min-h-screen">
            <CustomDialog
                dialogTitle="Crear agente"
                dialogDescription="Registrar un nuevo agente al equipo."
                propDialogContent={
                    <FormularioNuevoAgente onSubmit={handleCreateNewAgente} />
                }
            />
            <div className="flex flex-col gap-2 md:flex-row md:justify-between">
                <Link href="/agentes/zonas">
                    <Button
                        className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                        <span >Administrar zonas</span>
                        <Map />
                    </Button>
                </Link>
                <SearchInput placeholder="Buscar por nombre..." />
                <Button
                    className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => handleNewAgente()} >
                    <span >Crear Agente</span>
                    <Plus />
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agentes.map((agente) => (
                    <AgenteCard key={agente.id} agente={agente} onDelete={() => console.log("Eliminando agente")} />
                ))}
            </div>
            <PaginationInstruments totalPages={totalPages} />
        </div>
    );
}
