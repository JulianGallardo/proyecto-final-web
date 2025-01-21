"use client"

import * as React from "react"
import { FormularioInstrumento } from "./Forms/formulario-instrumento"
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
import { TablaInstrumentos } from "./Tabla/tabla-instrumento"
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "../ui/pagination"
import InstrumentosDialogs from "./Dialogs/instrumentos-Dialogs"


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

            {InstrumentosDialogs(dialogoAbierto, handleClose, instrumentoEditando, Juzgados, instrumentoTypes, handleEditar, handleCrear)}


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

            



        </div >
    )
}



