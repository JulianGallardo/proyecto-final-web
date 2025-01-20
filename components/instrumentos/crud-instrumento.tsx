"use client"

import * as React from "react"
import TablaInstrumentos from "./tabla-instrumento"
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
import { TooltipProvider } from "@radix-ui/react-tooltip"
import { Plus } from "@mynaui/icons-react"
import { InstrumentoDTO, InstrumentoExtendido } from "@/types/instrumento"
import { createInstrumento, getInstrumentos, getInstrumentTypes, getJuzgados, updateInstrumento } from "@/actions/instrumentos-actions"
import FiltrosList from "./filtros-list"
import { InstrumentoType, Juzgado } from "@prisma/client"

// Datos de ejemplo


export function CrudInstrumentos() {
    const [instrumentos, setInstrumentos] = React.useState<InstrumentoExtendido[]>([])
    const [Juzgados, setJuzgados] = React.useState<Juzgado[]>([])
    const [instrumentoTypes, setInstrumentoTypes] = React.useState<InstrumentoType[]>([])
    const [instrumentoEditando, setInstrumentoEditando] = React.useState<InstrumentoExtendido | null>(null)
    const [dialogoAbierto, setDialogoAbierto] = React.useState(false)
    const [isMobile, setMobile] = React.useState(false)



    React.useEffect(() => {
        const fetchInstrumentos = async () => {
            const instrumentos = await getInstrumentos()
            console.log(instrumentos)
            setInstrumentos(instrumentos)
        }

        const fecthJuzgados = async () => {
            const juzgados = await getJuzgados()
            setJuzgados(juzgados)
        }

        const fetchInstrumentTypes = async () => {
            const instrumentTypes = await getInstrumentTypes()
            setInstrumentoTypes(instrumentTypes)
        }

        fetchInstrumentos()
        fecthJuzgados()
        fetchInstrumentTypes()
    }, [])

    React.useEffect(() => {
        const handleResize = () => {
            setMobile(window.innerWidth < 640)
        }

        window.addEventListener("resize", handleResize)
        handleResize()

        return () => window.removeEventListener("resize", handleResize)
    }, [])


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
        setInstrumentos([...instrumentos, instrumentoCreado])
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

        setInstrumentos(instrumentos.map(i => i.juzgadoId === instrumentoActualizado.juzgadoId && i.ordenNumber === instrumentoActualizado.ordenNumber ? instrumentoActualizado : i))

        setInstrumentoEditando(null)
        setDialogoAbierto(false)
    }

    const handleEliminar = (id: string) => {
        console.log(id)
    }

    return (
        <div className="space-y-4 p-4 w-full ">
            <TooltipProvider>
                <div className="flex flex-col  w-full">
                    <h2 className="text-2xl font-bold">Lista de Instrumentos</h2>
                    <div className="flex justify-between items-center">
                        <FiltrosList Juzgados={Juzgados} InstrumentTypes={instrumentoTypes} />
                        <Dialog open={dialogoAbierto} onOpenChange={handleClose} >
                            <DialogTrigger asChild>
                                {
                                    isMobile ? (
                                        <Button className="bg-green-500 hover:bg-green-800">
                                            <Plus />
                                        </Button>
                                    ) : (
                                        <Button className="bg-green-500 hover:bg-green-800">
                                            Agregar Instrumento
                                            <Plus />
                                        </Button>
                                    )
                                }
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
                    onEdit={(instrumento: InstrumentoExtendido) => {
                        setInstrumentoEditando(instrumento)
                        setDialogoAbierto(true)
                    }}
                    onDelete={handleEliminar}
                />
            </TooltipProvider>
        </div>
    )
}

