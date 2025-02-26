"use client";

import { EntregaInstrumentosDto, EntregaInstrumentoUpdateDto } from "@/types/entregasType";
import EntregasCard from "./entregasCard";
import { useCustomDialog } from "@/hooks/useCustomDialog";
import CustomDialog from "../instrumentos/Dialogs/dialog";
import { FormularioNuevaEntrega } from "./Forms/cargarEntrega";
import { useState } from "react";
import { updateEntrega } from "@/actions/entrega-instrumentos-actions";
import { toast } from "@/hooks/use-toast";




export default function EntregasList({ entregas, permisos }: Readonly<{ entregas: EntregaInstrumentosDto[], permisos?:boolean }>) {

    const { setIsOpen } = useCustomDialog();
    const [entrega, setEntrega] = useState<EntregaInstrumentosDto | null>(null);

    

    function handleOpenDialog(entrega: EntregaInstrumentosDto) {
        setEntrega(entrega);
        setIsOpen(true);
    }

    async function handleSubmit(data: EntregaInstrumentoUpdateDto) {


        try {
            const entregaActualizada = await updateEntrega(data.id, data);
            if (entregaActualizada) {
                toast({
                    title: "Entrega registrada",
                    description: "La entrega ha sido registrada con éxito.",
                    className: "bg-green-500 text-white",
                    duration: 3000,
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Ha ocurrido un error al registrar la entrega.",
                className: "bg-red-500 text-white",
                duration: 3000,
            });

        }



        handleCloseDialog();

    }

    function handleCloseDialog() {
        setIsOpen(false);
        setEntrega(null);
    }

    return (
        <div className="space-y-3">
            <CustomDialog
                dialogTitle="Cargar entrega"
                dialogDescription="Registrar una nueva entrega."
                customClose={true}
                onClose={handleCloseDialog}
                propDialogContent={
                    <FormularioNuevaEntrega onSubmit={handleSubmit} entrega={entrega} />
                }
            />
            {entregas.map((entrega) => {
                return <EntregasCard entrega={entrega} key={entrega.id} cargarEntrega={handleOpenDialog} permisos={permisos}/>;
            })}
        </div>
    );
}

