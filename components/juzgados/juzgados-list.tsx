"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useCustomDialog } from "@/hooks/useCustomDialog"
import { useCustomAlert } from "@/hooks/useCustomAlert"
import CustomDialog from "../instrumentos/Dialogs/dialog"
import CustomAlert from "../instrumentos/Dialogs/alert"



interface JuzgadosListProps {
    juzgados: JuzgadoDto[]
}

export default function JuzgadosList({ juzgados }: Readonly<JuzgadosListProps>) {
    const { setIsOpen } = useCustomDialog();
    const { setIsOpenAlert } = useCustomAlert();
    const [editingJuzgado, setIsEditingJuzgado] = useState<JuzgadoDto | null>(null);

    




    return (

        <div className="w-full">
            <CustomDialog
                dialogTitle="Agregar Juzgado"
                propDialogContent={<div>Formulario de Juzgado</div>}
                customClose={true}
                onClose={setIsOpen}
            />
            <CustomAlert
                AlertTitle="Eliminar Juzgado"
                AlertDescription="¿Está seguro que desea eliminar este juzgado?"
                propAlertDialogContent={
                    <div className="flex justify-end">
                        <Button className="bg-red-500 hover:bg-red-600" onClick={() => setIsOpenAlert(false)}>
                            Cancelar
                        </Button>
                        <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => setIsOpenAlert(false)}>
                            Aceptar
                        </Button>
                    </div>
                }
            />
            <Button className="mb-4 bg-green-500 hover:bg-green-600" onClick={() => setIsOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Agregar Juzgado
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                { juzgados && juzgados.map((juzgado) => (
                    <JuzgadosCard
                        key={juzgado.id}
                        juzgado={juzgado}
                        onEdit={() => {
                        }}
                        onDelete={() => setIsOpenAlert(true)}
                    />

                ))}
            </div>
        </div>
    )
}

function JuzgadosCard({ juzgado, onEdit, onDelete }: { juzgado: JuzgadoDto; onEdit: () => void; onDelete: () => void }) {
    return (
        <Card >
            <CardContent className="flex flex-col items-start p-4">
                <h2 className="text-xl font-bold">{juzgado.name}</h2>
                <p className="text-sm text-gray-500">Identificador: {juzgado.identifier}</p>
                <p className="text-sm text-gray-500">Creado: {juzgado.createdAt}</p>
                <p className="text-sm text-gray-500">Actualizado: {juzgado.updatedAt}</p>
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

