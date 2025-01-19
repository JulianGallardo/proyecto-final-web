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
import { InstrumentoExtendido } from "@/types/instrumento"
import { getInstrumentos } from "@/actions/instrumentos-actions"

// Datos de ejemplo


export function CrudInstrumentos() {
    const [instrumentos, setInstrumentos] = React.useState<InstrumentoExtendido[]>([])
    const [instrumentoEditando, setInstrumentoEditando] = React.useState<InstrumentoExtendido | null>(null)
    const [dialogoAbierto, setDialogoAbierto] = React.useState(false)
    const [isMobile, setMobile] = React.useState(false)



    React.useEffect(() => {
        const fetchInstrumentos = async () => {
            const instrumentos = await getInstrumentos()
            setInstrumentos(instrumentos)
        }
        fetchInstrumentos()
    }, [])

    React.useEffect(() => {
        const handleResize = () => {
            setMobile(window.innerWidth < 640)
        }

        window.addEventListener("resize", handleResize)
        handleResize()

        return () => window.removeEventListener("resize", handleResize)
    }, [])
    

    const handleCrear = (nuevoInstrumento: InstrumentoExtendido) => {
        setInstrumentos([...instrumentos, nuevoInstrumento])
        setDialogoAbierto(false)
    }

    const handleEditar = (instrumentoEditado: InstrumentoExtendido) => {
        setInstrumentos(instrumentos.map(i => i.juzgadoId === instrumentoEditado.juzgadoId && i.ordenNumber === instrumentoEditado.ordenNumber ? instrumentoEditado : i))
        setInstrumentoEditando(null)
        setDialogoAbierto(false)
    }

    const handleEliminar = (id: string) => {
        console.log(id)
    }

    return (
        <div className="space-y-4 p-4 w-full ">
            <TooltipProvider>
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Lista de Instrumentos</h2>
                    <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
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
                                instrumento={instrumentoEditando || undefined}
                                onSubmit={instrumentoEditando ? handleEditar : handleCrear}
                            />
                        </DialogContent>
                    </Dialog>
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

