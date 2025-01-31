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
import { createInstrumentType, deleteInstrumentType, updateInstrumentType } from "@/actions/instrumentos-actions"
import { toast } from "@/hooks/use-toast"
import { FormularioType } from "./forms/type-form"
import SearchInput from "../shared/search"
import { InstrumentoTypeDTO, InstrumentoTypeInput } from "@/types/instrumentoTypes"
import NoResults from "../shared/noResults"



interface TypesListProps {
    tipos: InstrumentoTypeDTO[]
}

export default function TypeList({ tipos }: Readonly<TypesListProps>) {
    const { setIsOpen } = useCustomDialog();
    const { setIsOpenAlert } = useCustomAlert();
    const [editingType, setEditingType] = useState<InstrumentoTypeDTO | null>(null);
    const [TypeToDelete, setTypeToDelete] = useState<InstrumentoTypeDTO | null>(null);

    async function handleSubmit(data: InstrumentoTypeInput) {
        try {
            const Type = await createInstrumentType(data);
            if (Type) {
                toast({
                    title: "Tipo de instrumento creado",
                    description: "El nuevo tipo de instrumento se ha creado correctamente",
                    className: "bg-green-500 text-white",
                    duration: 3000,
                });
            }

        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: (error instanceof Error ? error.message : "Ha ocurrido un error al crear el tipo de instrumento"),
                className: "bg-red-500 text-white",
                duration: 3000,
            });
        }
        
        setIsOpen(false);
        setEditingType(null);
    }

    async function handleUpdate(data: InstrumentoTypeInput) {
        if (!editingType) {
            toast({
                title: "Error",
                description: "No se ha seleccionado un tipo de instrumento para editar",
                className: "bg-red-500 text-white",
                duration: 3000,
            });
            return;
        }
        try {
            const TypeActualizado = await updateInstrumentType(editingType?.id, data);
            if (TypeActualizado) {
                toast({
                    title: "Type actualizado",
                    description: `El tipo de instrumento ha sido actualizado correctamente`,
                    className: "bg-green-500 text-white",
                    duration: 3000,
                });
            }

        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: (error instanceof Error ? error.message : "Ha ocurrido un error al actualizar el tipo de instrumento"),
                className: "bg-red-500 text-white",
                duration: 3000,
            });
        }
        
        setIsOpen(false);
        setEditingType(null);
    }

    async function toDelete(Type: InstrumentoTypeDTO) {
        setTypeToDelete(Type);
        setIsOpenAlert(true);
    }

    async function handleDelete() {
        if (!TypeToDelete) {
            toast({
                title: "Error",
                description: "No se ha seleccionado un tipo de instrumento para eliminar",
                className: "bg-red-500 text-white",
                duration: 3000,
            });
            return;
        }
        try {
            const TypeDeleted = await deleteInstrumentType(TypeToDelete.id);
            if (TypeDeleted) {
                toast({
                    title: "Type eliminado",
                    description: `El Type ha sido eliminado correctamente`,
                    className: "bg-green-500 text-white",
                    duration: 3000,
                });
            }

        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: (error instanceof Error ? error.message : "Ha ocurrido un error al eliminar el Type"),
                className: "bg-red-500 text-white",
                duration: 3000,
            });

        }
        
        setIsOpenAlert(false);
        setTypeToDelete(null);
    }



    function openUpdateDialog(Type: InstrumentoTypeDTO) {
        setEditingType(Type);
        setIsOpen(true);
    }

    function closeDialog() {
        setIsOpen(false);
        setEditingType(null);
    }




    return (

        <div className="w-full">
            <CustomDialog
                dialogTitle={editingType ? "Editar tipo de instrumento" : "Agregar tipo de instrumento"}
                propDialogContent={
                    <FormularioType Type={editingType} onSubmit={editingType ? handleUpdate : handleSubmit} Types={
                        tipos.filter((type) => type.id !== editingType?.id)
                    } />
                }
                customClose={true}
                onClose={() => closeDialog()}
            />
            <CustomAlert
                AlertTitle="Eliminar tipo de instrumento"
                AlertDescription="¿Está seguro que desea eliminar este tipo de instrumento?"
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
                    <Plus className="mr-2 h-4 w-4" /> Agregar tipo de instrumento
                </Button>
                <SearchInput placeholder="Buscar tipo de instrumento por nombre" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tipos.map((type) => (
                    <TypeCard
                        key={type.id}
                        type={type}
                        onEdit={
                            () => openUpdateDialog(type)
                        }
                        onDelete={() => toDelete(type)}
                    />

                ))}
            </div>
            {tipos.length === 0 && <NoResults />}
        </div>
    )
}

function TypeCard({ type, onEdit, onDelete }: Readonly<{ type:InstrumentoTypeDTO; onEdit: () => void; onDelete: () => void }>) {
    return (
        <Card >
            <CardContent className="flex flex-col items-start p-4 h-2/3">
                <h2 className="text-xl font-bold">{type.name}</h2>
                <p className="text-sm text-gray-500">Identificador: {type.identifier}</p>
                <p className="text-sm text-gray-500">Creado: {parseDate(type.createdAt?.toISOString())}</p>
                <p className="text-sm text-gray-500">Actualizado: {parseDate(type.updatedAt?.toISOString())}</p>
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

