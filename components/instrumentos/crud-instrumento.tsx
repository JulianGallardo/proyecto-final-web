"use client"

import * as React from "react"

import { InstrumentoDTO, InstrumentoExtendido,  } from "@/types/instrumentoTypes"
import { createInstrumento, deleteInstrumento, updateInstrumento } from "@/actions/instrumentos-actions"
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
import Link from "next/link"


interface CrudInstrumentosProps {
    instrumentos: InstrumentoExtendido[]
    Juzgados: Juzgado[]
    instrumentoTypes: InstrumentoType[],
}

export function CrudInstrumentos({ instrumentos, Juzgados, instrumentoTypes }: Readonly<CrudInstrumentosProps>) {
    const [instrumentoEditando, setInstrumentoEditando] = React.useState<InstrumentoExtendido | undefined>(undefined)
    const [instrumentoEliminando, setInstrumentoEliminando] = React.useState<InstrumentoExtendido | undefined>(undefined)

    const { setIsOpen } = useCustomDialog()
    const { setIsOpenAlert } = useCustomAlert()
    const { setJuzgados, setInstrumentoTypes } = useInfoInstrumentos()

    React.useEffect(() => {
        setJuzgados(Juzgados)
        setInstrumentoTypes(instrumentoTypes)
    }, [Juzgados, instrumentoTypes])


    const handleClose = (open: boolean) => {
        if (!open) {
            setIsOpen(false)
            setInstrumentoEditando(undefined)
        }
        else
            setIsOpen(open)
    }


    const handleCrear = async (nuevoInstrumento: InstrumentoDTO) => {


        try {

            const instrumentoCreado = await createInstrumento(nuevoInstrumento)

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
        setInstrumentoEliminando(instrumento)
        setIsOpenAlert(true)
    }



    const handleEditar = async (instrumentoEditado: InstrumentoDTO) => {
        if (!instrumentoEditando) return

        try {
            const instrumentoActualizado = await updateInstrumento(instrumentoEditando.orden.juzgado.identifier, instrumentoEditando.orden.ordenNumber, instrumentoEditado)
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


    const handleEliminar = async () => {
        if (!instrumentoEliminando) {
            toast({
                title: "Error",
                description: "Ha ocurrido un error al eliminar el instrumento",
                className: "bg-red-500 text-white",
                duration: 3000,
            });
            setIsOpenAlert(false)
            return
        }
        const instrumentoEliminado = await deleteInstrumento(instrumentoEliminando.orden.juzgado.identifier, instrumentoEliminando.orden.ordenNumber)
        if (!instrumentoEliminado) return
        setIsOpenAlert(false)
        setInstrumentoEditando(undefined)
        toast({
            title: "Éxito",
            description: "Instrumento eliminado correctamente",
            className: "bg-green-500 text-white",
            duration: 3000,
        });
    }

    const cancelEliminar = () => {
        setInstrumentoEliminando(undefined)
        setIsOpenAlert(false)
    }

    const convertToDto = (instrumento: InstrumentoExtendido|undefined): InstrumentoDTO|undefined => {
        if (!instrumento){
            return undefined
        }

        
        const instrumentoDto: InstrumentoDTO = {
            fecha_de_ingreso: instrumento.fecha_de_ingreso,
            fecha_de_salida: instrumento.fecha_de_salida,
            caratula: instrumento.caratula,
            destinatario: instrumento.destinatario,
            domicilio_denunciado: instrumento.domicilio_denunciado,
            juzgadoIdentifier: instrumento.orden.juzgado.identifier,
            instrumentoTypeIdentifier: instrumento.instrumentoType.identifier
        }

        return instrumentoDto
    }




    return (
        <div className="space-y-4 w-full h-full">

            <CustomDialog
                dialogTitle={instrumentoEditando ? `Editar Instrumento ${instrumentoEditando.orden.ordenNumber} ${instrumentoEditando.orden.juzgado.identifier}` : "Crear Instrumento"}
                dialogDescription={instrumentoEditando ? "Edita los campos del instrumento" : "Crea un nuevo instrumento"}
                propDialogContent={
                    <FormularioInstrumento
                        instrumentoTypes={instrumentoTypes}
                        Juzgados={Juzgados}
                        onSubmit={instrumentoEditando ? handleEditar : handleCrear}
                        instrumento={convertToDto(instrumentoEditando)}
                    />
                }
                customClose={true}
                onClose={handleClose}
            />
            <CustomAlert
                AlertTitle={"Eliminar Instrumento " + (instrumentoEliminando?.orden.ordenNumber ?? "") + " " + (instrumentoEliminando?.orden.juzgado.identifier || "")}
                AlertDescription="¿Estás seguro de que deseas eliminar este instrumento?"
                propAlertDialogContent={
                    <div className="flex flex-row justify-center gap-4">
                        <Button
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => handleEliminar()}
                        >
                            Eliminar
                        </Button>
                        <Button
                            className="bg-blue-500 hover:bg-blue-600"
                            onClick={() => cancelEliminar()}
                        >
                            Cancelar
                        </Button>
                    </div>
                }
            />





            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <Button
                    onClick={onCreate}
                    className="bg-green-500 hover:bg-green-600"
                >
                    Crear Instrumento
                    <Plus className="h-4 w-4 text-white" />
                </Button>
                <Link href="/instrumentos/upload">
                    <Button
                        className="bg-blue-500 hover:bg-blue-600"
                    >


                        Cargar instrumentos por PDF

                    </Button>
                </Link>
            </div>




            <TablaInstrumentos
                data={instrumentos}
                onEdit={onEdit}
                onDelete={onDelete}

            />





        </div >
    )
}



