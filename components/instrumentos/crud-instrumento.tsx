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
        const instrumentoCreado = await createInstrumento(instrumentDto)
        setDialogoAbierto(false)
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
        console.log(instrumentoActualizado)
        if (!instrumentoActualizado) return

        setInstrumentoEditando(null)
        setDialogoAbierto(false)
    }

    const handleEliminar = (id: string) => {
        console.log(id)
    }

    return (
        <div className="space-y-4 w-full h-full">

            <div className="flex flex-col  w-full">
                <div className="flex flex-col md:flex-row md:justify-between gap-4">
                    <FiltrosList Juzgados={Juzgados} InstrumentTypes={instrumentoTypes} />
                    <Dialog open={dialogoAbierto} onOpenChange={handleClose} >
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
                                onSubmit={instrumentoEditando ? handleEditar : handleCrear}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <TablaInstrumentos
                data={instrumentos}
                currentPage={currentPage}
                totalPages={totalPages}
                openDelete={null}
                onEdit={handleEditar}
                onDelete={handleEliminar}
                setOpenDelete={function (id: string | null): void {
                    throw new Error("Function not implemented.")
                }}
            />

        </div>
    )
}


