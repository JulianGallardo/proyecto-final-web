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
import { Button } from "../ui/button"
import { Plus } from "@mynaui/icons-react"
import CustomAlert from "./Dialogs/alert"
import { useCustomAlert } from "@/hooks/useCustomAlert"
import { toast } from "@/hooks/use-toast";


interface CrudInstrumentosProps {
    instrumentos: InstrumentoExtendido[]
    Juzgados: Juzgado[]
    instrumentoTypes: InstrumentoType[],
}

export function CrudInstrumentos({ instrumentos, Juzgados, instrumentoTypes }: Readonly<CrudInstrumentosProps>) {
    const [instrumentoEditando, setInstrumentoEditando] = React.useState<InstrumentoExtendido | undefined>(undefined)

    const {  setIsOpen } = useCustomDialog()
    const { setIsOpenAlert } = useCustomAlert()
    const { setJuzgados, setInstrumentoTypes } = useInfoInstrumentos()

    React.useEffect(() => {
        setJuzgados(Juzgados)
        setInstrumentoTypes(instrumentoTypes)
        console.log(instrumentos)
    }, [Juzgados, instrumentoTypes])


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

        try {

            const instrumentoCreado = await createInstrumento(instrumentDto)

            if (!instrumentoCreado) return

        } catch (error) {

            toast({
                title: "Error",
                description: (error instanceof Error ? error.message : "Ha ocurrido un error al crear el instrumento"),
                className: "bg-red-500 text-white",
                duration: 3000,
            });
        }

        toast({
            title: "Éxito",
            description: "Instrumento creado correctamente",
            className: "bg-green-500 text-white",
            duration: 3000,
        });




        setIsOpen(false)


    }


    const onCreate = () => {
        setInstrumentoEditando(undefined)
        setIsOpen(true)
    }

    const onEdit = (instrumento: InstrumentoExtendido) => {
        setInstrumentoEditando(instrumento)
        setIsOpen(true)
    }

    const onDelete = (instrumento: InstrumentoExtendido) => {
        console.log(instrumento)
        setIsOpenAlert(true)
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
        try {
            const instrumentoActualizado = await updateInstrumento(instrumentoEditando.juzgadoId, instrumentoEditando.ordenNumber, instrumentDto)
            if (!instrumentoActualizado) return
        } catch (error) {
            toast({
                title: "Error",
                description: (error instanceof Error ? error.message : "Ha ocurrido un error al editar el instrumento"),
                className: "bg-red-500 text-white",
                duration: 3000,
            });

        }


        toast({
            title: "Éxito",
            description: "Instrumento actualizado correctamente",
            className: "bg-green-500 text-white",
            duration: 3000,
        });

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
            <CustomAlert
                AlertTitle="Eliminar Instrumento"
                AlertDescription="¿Estás seguro de que deseas eliminar este instrumento?"
                propAlertDialogContent={
                    <div className="flex flex-row justify-center gap-4">
                        <Button
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => setIsOpenAlert(false)}
                        >
                            Eliminar
                        </Button>
                        <Button
                            className="bg-blue-500 hover:bg-blue-600"
                            onClick={() => setIsOpenAlert(false)}
                        >
                            Cancelar
                        </Button>
                    </div>
                }
            />






            <Button
                onClick={onCreate}
                className="bg-green-500 hover:bg-green-600"
            >
                Crear Instrumento
                <Plus className="h-4 w-4 text-white" />
            </Button>


            <TablaInstrumentos
                data={instrumentos}
                onEdit={onEdit}
                onDelete={onDelete}

            />





        </div >
    )
}



