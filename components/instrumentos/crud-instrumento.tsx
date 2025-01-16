"use client"

import * as React from "react"
import TablaInstrumentos from "./tabla-instrumento"
import { FormularioInstrumento } from "./formulario-instrumento"
import { Instrumento } from "@/types/instrumento"
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

// Datos de ejemplo
const instrumentosEjemplo: Instrumento[] = [
    {
        id: "1",
        fechaEntrada: new Date("2023-05-15"),
        caratula: "Caso Pérez vs. González",
        destinatario: "Juzgado Civil N°5",
        direccion: "Av. Corrientes 1234, CABA",
        numeroOrden: "2023-001",
        identificadorJuzgado: "JC-005",
        tipoInstrumento: "Demanda Civil"
    },
    {
        id: "2",
        fechaEntrada: new Date("2023-05-20"),
        caratula: "Sucesión Rodríguez",
        destinatario: "Juzgado de Familia N°3",
        direccion: "Calle Lavalle 2468, CABA",
        numeroOrden: "2023-002",
        identificadorJuzgado: "JF-003",
        tipoInstrumento: "Expediente Sucesorio"
    },
    {
        id: "3",
        fechaEntrada: new Date("2023-05-25"),
        caratula: "Ministerio Público vs. Gómez",
        destinatario: "Tribunal Penal N°2",
        direccion: "Av. de Mayo 5678, CABA",
        numeroOrden: "2023-003",
        identificadorJuzgado: "TP-002",
        tipoInstrumento: "Causa Penal"
    }
]

export function CrudInstrumentos() {
    const [instrumentos, setInstrumentos] = React.useState<Instrumento[]>(instrumentosEjemplo)
    const [instrumentoEditando, setInstrumentoEditando] = React.useState<Instrumento | null>(null)
    const [dialogoAbierto, setDialogoAbierto] = React.useState(false)

    const handleCrear = (nuevoInstrumento: Instrumento) => {
        setInstrumentos([...instrumentos, nuevoInstrumento])
        setDialogoAbierto(false)
    }

    const handleEditar = (instrumentoEditado: Instrumento) => {
        setInstrumentos(instrumentos.map(i => i.id === instrumentoEditado.id ? instrumentoEditado : i))
        setInstrumentoEditando(null)
        setDialogoAbierto(false)
    }

    const handleEliminar = (id: string) => {
        setInstrumentos(instrumentos.filter(i => i.id !== id))
    }

    return (
        <div className="space-y-4 p-4 w-full ">
            <TooltipProvider>
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Lista de Instrumentos</h2>
                    <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
                        <DialogTrigger asChild>
                            <Button>Crear Nuevo Instrumento</Button>
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
                    onEdit={(instrumento: Instrumento) => {
                        setInstrumentoEditando(instrumento)
                        setDialogoAbierto(true)
                    }}
                    onDelete={handleEliminar}
                />
            </TooltipProvider>
        </div>
    )
}

