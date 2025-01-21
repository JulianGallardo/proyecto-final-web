"use client"

import * as React from "react"
import { FormularioInstrumento } from "./formulario-instrumento"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Plus } from "@mynaui/icons-react"
import { InstrumentoDTO, InstrumentoExtendido } from "@/types/instrumento"
import { createInstrumento, updateInstrumento } from "@/actions/instrumentos-actions"
import FiltrosList from "./filtros-list"
import { InstrumentoType, Juzgado } from "@prisma/client"
import { TablaInstrumentos } from "./tabla-instrumento"
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "../ui/pagination"


interface CrudInstrumentosProps {
    instrumentos: InstrumentoExtendido[]
    Juzgados: Juzgado[]
    instrumentoTypes: InstrumentoType[],
    currentPage: number,
    totalPages: number
}

export function CrudInstrumentos({ instrumentos, Juzgados, instrumentoTypes, currentPage, totalPages }: Readonly<CrudInstrumentosProps>) {
    const [instrumentoEditando, setInstrumentoEditando] = React.useState<InstrumentoExtendido | null>(null)
    const [dialogoAbierto, setDialogoAbierto] = React.useState(false)
    

    const handleClose = (open: boolean) => {
        if (!open) {
            setDialogoAbierto(false)
            setInstrumentoEditando(null)
        }
        else
            setDialogoAbierto(open)
    }

    const handleCrear = async (nuevoInstrumento: InstrumentoExtendido) => {

        const instrumentDto: InstrumentoDTO = {
            entryDate: nuevoInstrumento.entryDate,
            exitDate: nuevoInstrumento.exitDate,
            caratula: nuevoInstrumento.caratula,
            destinatario: nuevoInstrumento.destinatario,
            address: nuevoInstrumento.address,
            juzgadoIdentifier: nuevoInstrumento.juzgado.identifier,
            instrumentoTypeIdentifier: nuevoInstrumento.instrumentoType.identifier,
        }
        await createInstrumento(instrumentDto)
        setDialogoAbierto(false)
    }

    const onEdit = (instrumento: InstrumentoExtendido) => {
        setInstrumentoEditando(instrumento)
        setDialogoAbierto(true)
    }

    const onDelete = (id: string) => {
        console.log(id)
    }


    const handleEditar = async (instrumentoEditado: InstrumentoExtendido) => {
        if (!instrumentoEditando) return

        const instrumentDto: InstrumentoDTO = {
            entryDate: instrumentoEditado.entryDate,
            exitDate: instrumentoEditado.exitDate,
            caratula: instrumentoEditado.caratula,
            destinatario: instrumentoEditado.destinatario,
            address: instrumentoEditado.address,
            juzgadoIdentifier: instrumentoEditado.juzgado.identifier,
            instrumentoTypeIdentifier: instrumentoEditado.instrumentoType.identifier,
        }
        const instrumentoActualizado = await updateInstrumento(instrumentoEditando.juzgadoId, instrumentoEditando.ordenNumber, instrumentDto)
        if (!instrumentoActualizado) return

        setInstrumentoEditando(null)
        setDialogoAbierto(false)
    }


    return (
        <div className="space-y-4 w-full h-full">

            {Dialogs(dialogoAbierto, handleClose, instrumentoEditando, Juzgados, instrumentoTypes, handleEditar, handleCrear)}


            <TablaInstrumentos
                data={instrumentos}
                currentPage={currentPage}
                totalPages={totalPages}
                openDelete={null}
                onEdit={onEdit}
                onDelete={onDelete}
                setOpenDelete={function (id: string | null): void {
                    console.log(id)
                    throw new Error("Function not implemented.")
                }}
            />

            <Pagination className="mt-4">
                <PaginationContent className="flex space-x-2">
                    {totalPages > 0 &&
                        Array.from({ length: totalPages }, (_, i) => (
                            <PaginationItem key={i + 1} className="text-sm">
                                <PaginationLink
                                    href={`?page=${i + 1}`}
                                    className={`px-3 py-1 rounded-md border ${currentPage === i + 1
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-100 border-gray-300 hover:bg-blue-500 hover:text-white"
                                        } transition-colors duration-200`}
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                </PaginationContent>
            </Pagination>



        </div >
    )
}


function Dialogs(dialogoAbierto: boolean, handleClose: (open: boolean) => void, instrumentoEditando: InstrumentoExtendido | null, Juzgados: { name: string; id: number; identifier: string; createdAt: Date; updatedAt: Date }[], instrumentoTypes: { name: string; id: number; identifier: string; createdAt: Date; updatedAt: Date }[], handleEditar: (instrumentoEditado: InstrumentoExtendido) => Promise<void>, handleCrear: (nuevoInstrumento: InstrumentoExtendido) => Promise<void>) {

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

