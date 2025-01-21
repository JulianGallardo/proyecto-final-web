import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InstrumentoExtendido } from "@/types/instrumento";
import { Plus } from "lucide-react";
import { FormularioInstrumento } from "../Forms/formulario-instrumento";

export default function InstrumentosDialogs(dialogoAbierto: boolean, handleClose: (open: boolean) => void, instrumentoEditando: InstrumentoExtendido | null, Juzgados: { name: string; id: number; identifier: string; createdAt: Date; updatedAt: Date }[], instrumentoTypes: { name: string; id: number; identifier: string; createdAt: Date; updatedAt: Date }[], handleEditar: (instrumentoEditado: InstrumentoExtendido) => Promise<void>, handleCrear: (nuevoInstrumento: InstrumentoExtendido) => Promise<void>) {

    return (
        <>
            <Dialog open={dialogoAbierto} onOpenChange={handleClose}>
                <DialogTrigger asChild>

                    <Button className="bg-green-500 hover:bg-green-800">
                        Agregar Instrumento
                        <Plus />
                    </Button>


                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{instrumentoEditando ? "Editar" : "Crear"} Instrumento</DialogTitle>
                        <DialogDescription>
                            {instrumentoEditando ? "Modifica los detalles del instrumento aquí." : "Ingresa los detalles del nuevo instrumento aquí."}
                        </DialogDescription>
                    </DialogHeader>
                    <FormularioInstrumento
                        Juzgados={Juzgados}
                        instrumentoTypes={instrumentoTypes}
                        instrumento={instrumentoEditando || undefined}
                        onSubmit={instrumentoEditando ? handleEditar : handleCrear} />
                </DialogContent>
            </Dialog>
            <>
                {
                    //TODO: DELETE DIALOG
                }

            </>

        </>
    )

}