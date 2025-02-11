import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { InstrumentoExtendido } from "@/types/instrumentoTypes"

export default function InstrumentSelector({ instruments }: Readonly<{ instruments: InstrumentoExtendido[] }>) {
    const [selectedInstruments, setSelectedInstruments] = useState<InstrumentoExtendido[]>([])
    const [message, setMessage] = useState<string>("")
    const [searchTerm, setSearchTerm] = useState("")
    const [step, setStep] = useState<"select" | "review">("select")

    const filteredInstruments = useMemo(() => {
        return instruments.filter((instrument) => {
            const searchLower = searchTerm.toLowerCase()
            return (
                instrument.codigoInstrumento.toLowerCase().includes(searchLower) ||
                instrument.instrumentoType.name.toLowerCase().includes(searchLower) ||
                instrument.caratula.toLowerCase().includes(searchLower) ||
                instrument.destinatario.toLowerCase().includes(searchLower) ||
                (instrument.zoneName?.toLowerCase().includes(searchLower) ?? false)
            )
        })
    }, [instruments, searchTerm])

    const handleToggleInstrument = (instrument: InstrumentoExtendido) => {
        setSelectedInstruments((prev) =>
            prev.some((i) => i.codigoInstrumento === instrument.codigoInstrumento)
                ? prev.filter((i) => i.codigoInstrumento !== instrument.codigoInstrumento)
                : [...prev, instrument],
        )
    }

    const handleDistribute = async () => {
        if (selectedInstruments.length === 0) {
            setMessage("Por favor, seleccione al menos un instrumento.")
            return
        }

        console.log("Distribuyendo instrumentos", selectedInstruments)
    }

    const handleSelectAll = () => {
        setSelectedInstruments(filteredInstruments)
    }

    const handleClearSelection = () => {
        setSelectedInstruments([])
    }

    if (step === "select") {
        return (
            <div className="space-y-4 w-full h-full">
                <Card>
                    <CardHeader>
                        <CardTitle>Seleccionar Instrumentos para Distribuir</CardTitle>
                        <CardDescription>
                            Seleccione los instrumentos que desea distribuir. Puede buscar por código, tipo, destinatario o zona.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 space-y-4">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Buscar instrumentos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                                    Seleccionar Todo
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleClearSelection}>
                                    Limpiar Selección
                                </Button>
                            </div>
                        </div>
                        <ScrollArea className="h-[400px] pr-4">
                            <div className="grid gap-2">
                                {filteredInstruments.map((instrument) => (
                                    <div
                                        key={instrument.codigoInstrumento}
                                        className="flex items-start space-x-3 p-2 rounded hover:bg-gray-100 transition-colors"
                                    >
                                        <Checkbox
                                            id={instrument.codigoInstrumento}
                                            checked={selectedInstruments.some((i) => i.codigoInstrumento === instrument.codigoInstrumento)}
                                            onCheckedChange={() => handleToggleInstrument(instrument)}
                                            className="mt-1"
                                        />
                                        <div className="flex-1">
                                            <label
                                                htmlFor={instrument.codigoInstrumento}
                                                className="text-sm font-medium leading-none cursor-pointer"
                                            >
                                                {instrument.instrumentoType.name} - {instrument.codigoInstrumento}
                                            </label>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {instrument.caratula} • {instrument.zoneName}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        {selectedInstruments.length} instrumento(s) seleccionado(s)
                    </p>
                    <Button
                        onClick={() => setStep("review")}
                        disabled={selectedInstruments.length === 0}
                    >
                        Revisar Selección ({selectedInstruments.length})
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Revisar Instrumentos Seleccionados</CardTitle>
                    <CardDescription>
                        Revise los detalles de los instrumentos seleccionados antes de la distribución.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[400px] pr-4">
                        <div className="grid gap-4">
                            {selectedInstruments.map((instrument) => (
                                <Card key={instrument.codigoInstrumento}>
                                    <CardContent className="pt-6">
                                        <div className="grid gap-2">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-semibold">
                                                    {instrument.instrumentoType.name} - {instrument.codigoInstrumento}
                                                </h3>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleToggleInstrument(instrument)}
                                                >
                                                    Quitar
                                                </Button>
                                            </div>
                                            <div className="grid gap-1 text-sm">
                                                <p><strong>Carátula:</strong> {instrument.caratula}</p>
                                                <p><strong>Destinatario:</strong> {instrument.destinatario}</p>
                                                <p><strong>Domicilio:</strong> {instrument.domicilio_denunciado}</p>
                                                <p><strong>Juzgado:</strong> {instrument.orden.juzgado.name}</p>
                                                <p><strong>Zona:</strong> {instrument.zoneName}</p>
                                                <p><strong>Fecha de Ingreso:</strong> {instrument.fecha_de_ingreso.toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            <div className="flex items-center justify-between gap-4">
                <Button variant="outline" onClick={() => setStep("select")}>
                    Volver a Selección
                </Button>
                <Button onClick={handleDistribute} disabled={selectedInstruments.length === 0}>
                    Distribuir {selectedInstruments.length} Instrumento(s)
                </Button>
            </div>

            {message && (
                <Alert>
                    <AlertDescription>{message}</AlertDescription>
                </Alert>
            )}
        </div>
    )
}