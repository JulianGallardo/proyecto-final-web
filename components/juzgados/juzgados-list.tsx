"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useCustomDialog } from "@/hooks/useCustomDialog"
import { useCustomAlert } from "@/hooks/useCustomAlert"
import CustomDialog from "../instrumentos/Dialogs/dialog"
import CustomAlert from "../instrumentos/Dialogs/alert"
import { parseDate } from "@/lib/utils"
import { createJuzgado, deleteJuzgado, updateJuzgado } from "@/actions/instrumentos-actions"
import { toast } from "@/hooks/use-toast"
import { FormularioJuzgado } from "./forms/juzgado-form"
import SearchInput from "./search/search"



interface JuzgadosListProps {
    juzgados: JuzgadoDto[]
}

export default function JuzgadosList({ juzgados }: Readonly<JuzgadosListProps>) {
    const { setIsOpen } = useCustomDialog();
    const { setIsOpenAlert } = useCustomAlert();
    const [editingJuzgado, setEditingJuzgado] = useState<JuzgadoDto | null>(null);
    const [juzgadoToDelete, setJuzgadoToDelete] = useState<JuzgadoDto | null>(null);

    async function handleSubmit(data: JuzgadoInput) {
        try {
            const juzgado = await createJuzgado(data);
            if (juzgado) {
                toast({
                    title: "Juzgado creado",
                    description: "El juzgado se ha creado correctamente",
                    className: "bg-green-500 text-white",
                    duration: 3000,
                });
            }

        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: (error instanceof Error ? error.message : "Ha ocurrido un error al crear el juzgado"),
                className: "bg-red-500 text-white",
                duration: 3000,
            });
        }
        setEditingJuzgado(null);
        setIsOpen(false);
    }

    async function handleUpdate(data: JuzgadoInput) {
        if (!editingJuzgado) {
            toast({
                title: "Error",
                description: "No se ha seleccionado un juzgado para editar",
                className: "bg-red-500 text-white",
                duration: 3000,
            });
            return;
        }
        try {
            const juzgadoActualizado = await updateJuzgado(editingJuzgado?.id, data);
            if (juzgadoActualizado) {
                toast({
                    title: "Juzgado actualizado",
                    description: `El juzgado ha sido actualizado correctamente`,
                    className: "bg-green-500 text-white",
                    duration: 3000,
                });
            }

        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: (error instanceof Error ? error.message : "Ha ocurrido un error al actualizar el juzgado"),
                className: "bg-red-500 text-white",
                duration: 3000,
            });
        }
        setEditingJuzgado(null);
        setIsOpen(false);
    }

    async function toDelete(Juzgado: JuzgadoDto) {
        setJuzgadoToDelete(Juzgado);
        setIsOpenAlert(true);
    }

    async function handleDelete() {
        if (!juzgadoToDelete) {
            toast({
                title: "Error",
                description: "No se ha seleccionado un juzgado para eliminar",
                className: "bg-red-500 text-white",
                duration: 3000,
            });
            return;
        }
        try {
            const juzgadoDeleted = await deleteJuzgado(juzgadoToDelete.id);
            if (juzgadoDeleted) {
                toast({
                    title: "Juzgado eliminado",
                    description: `El juzgado ha sido eliminado correctamente`,
                    className: "bg-green-500 text-white",
                    duration: 3000,
                });
            }

        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: (error instanceof Error ? error.message : "Ha ocurrido un error al eliminar el juzgado"),
                className: "bg-red-500 text-white",
                duration: 3000,
            });

        }
        setJuzgadoToDelete(null);
        setIsOpenAlert(false);
    }



    function openUpdateDialog(Juzgado: JuzgadoDto) {
        setEditingJuzgado(Juzgado);
        setIsOpen(true);
    }

    function closeDialog() {
        setEditingJuzgado(null);
        setIsOpen(false);
    }




    return (

        <div className="w-full">
            <CustomDialog
                dialogTitle="Agregar Juzgado"
                propDialogContent={
                    <FormularioJuzgado Juzgado={editingJuzgado} onSubmit={editingJuzgado ? handleUpdate : handleSubmit} Juzgados={
                        juzgados.filter(juzgado => juzgado.id !== editingJuzgado?.id)
                    } />
                }
                customClose={true}
                onClose={() => closeDialog()}
            />
            <CustomAlert
                AlertTitle="Eliminar Juzgado"
                AlertDescription="¿Está seguro que desea eliminar este juzgado?"
                propAlertDialogContent={
                    <div className="flex justify-between">
                        <Button className="bg-red-500 hover:bg-red-600" onClick={() => setIsOpenAlert(false)}>
                            Cancelar
                        </Button>
                        <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => handleDelete()}>
                            Aceptar
                        </Button>
                    </div>
                }
            />

            <div className="flex flex-col md:flex-row gap-4  justify-between items-center mb-4">
                <Button className="mb-4 bg-green-500 hover:bg-green-600 w-full md:w-fit" onClick={() => setIsOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Agregar Juzgado
                </Button>
                <SearchInput placeholder="Buscar juzgado por nombre" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {juzgados.map((juzgado) => (
                    <JuzgadosCard
                        key={juzgado.id}
                        juzgado={juzgado}
                        onEdit={
                            () => openUpdateDialog(juzgado)
                        }
                        onDelete={() => toDelete(juzgado)}
                    />

                ))}
            </div>
        </div>
    )
}

function JuzgadosCard({ juzgado, onEdit, onDelete }: Readonly<{ juzgado: JuzgadoDto; onEdit: () => void; onDelete: () => void }>) {
    return (
        <Card >
            <CardContent className="flex flex-col items-start p-4 h-2/3">
                <h2 className="text-xl font-bold">{juzgado.name}</h2>
                <p className="text-sm text-gray-500">Identificador: {juzgado.identifier}</p>
                <p className="text-sm text-gray-500">Creado: {parseDate(juzgado.createdAt?.toISOString())}</p>
                <p className="text-sm text-gray-500">Actualizado: {parseDate(juzgado.updatedAt?.toISOString())}</p>
            </CardContent>
            <CardFooter className="flex justify-between p-4">
                <Button className="bg-blue-500 hover:bg-blue-600" onClick={onEdit}>
                    <Pencil className="mr-2 h-4 w-4" /> Editar
                </Button>
                <Button className="bg-red-500 hover:bg-red-600" onClick={onDelete}>
                    <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                </Button>
            </CardFooter>
        </Card>
    )
}

