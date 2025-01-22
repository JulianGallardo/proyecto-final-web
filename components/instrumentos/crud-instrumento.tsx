"use client"

import * as React from "react"

import { InstrumentoDTO, InstrumentoExtendido } from "@/types/instrumento"
import { createInstrumento, updateInstrumento } from "@/actions/instrumentos-actions"
import { InstrumentoType, Juzgado } from "@prisma/client"
import { TablaInstrumentos } from "./Tabla/tabla-instrumento"
import CustomDialog from "./Dialogs/dialog"
import { FormularioInstrumento } from "./Forms/formulario-instrumento"
import useInfoInstrumentos from "@/hooks/useInfoInstrumentos"
import { useCustomDialog } from "@/hooks/useCustomDialog"


interface CrudInstrumentosProps {
    instrumentos: InstrumentoExtendido[]
    Juzgados: Juzgado[]
    instrumentoTypes: InstrumentoType[],
    currentPage: number,
    totalPages: number
}

export function CrudInstrumentos({ instrumentos, Juzgados, instrumentoTypes, currentPage, totalPages }: Readonly<CrudInstrumentosProps>) {
    const [instrumentoEditando, setInstrumentoEditando] = React.useState<InstrumentoExtendido | undefined>(undefined)

    const { isOpen, setIsOpen } = useCustomDialog()
    const { setJuzgados, setInstrumentoTypes } = useInfoInstrumentos()

    React.useEffect(() => {
        setJuzgados(Juzgados)
        setInstrumentoTypes(instrumentoTypes)
    }, [Juzgados, instrumentoTypes])


    React.useEffect(() => {
        console.log(isOpen, "is open from crud")
    }
        , [isOpen])

    const handleClose = (open: boolean) => {
        if (!open) {
            setIsOpen(false)
            setInstrumentoEditando(undefined)
        }
        else
            setIsOpen(open)
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
        setIsOpen(false)
    }

    const onEdit = (instrumento: InstrumentoExtendido) => {
        console.log("Se edito" + instrumento.caratula)
        setInstrumentoEditando(instrumento)
        setIsOpen(true)
        console.log(isOpen, "is open from onEdit")
    }

    const onDelete = (instrumento: InstrumentoExtendido) => {
        console.log("Se elimino")
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
        
        setIsOpen(false)
        setInstrumentoEditando(undefined)
    }


    return (
        <div className="space-y-4 w-full h-full">

            <CustomDialog
                dialogTitle={instrumentoEditando ? `Editar Instrumento ${instrumentoEditando.ordenNumber} ${instrumentoEditando.juzgado.identifier}` : "Crear Instrumento"}
                dialogDescription={instrumentoEditando ? "Edita los campos del instrumento" : "Crea un nuevo instrumento"}
                propDialogContent={
                    <FormularioInstrumento
                        instrumentoTypes={instrumentoTypes}
                        Juzgados={Juzgados}
                        onSubmit={instrumentoEditando ? handleEditar : handleCrear}
                        instrumento={instrumentoEditando}
                    />
                }
                customClose={true}
                onClose={handleClose}
            />


            <TablaInstrumentos
                data={instrumentos}
                onEdit={onEdit}
                onDelete={onDelete}

            />





        </div >
    )
}



