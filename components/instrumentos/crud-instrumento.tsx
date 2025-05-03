"use client"
import { InstrumentoDTO, InstrumentoExtendido, } from "@/types/instrumentoTypes"
import { createInstrumento, deleteInstrumento, updateInstrumento } from "@/actions/instrumentos-actions"
import { InstrumentoType, Juzgado } from "@prisma/client"
import CustomDialog from "./Dialogs/dialog"
import { FormularioInstrumento } from "./Forms/formulario-instrumento"
import useInfoInstrumentos from "@/hooks/useInfoInstrumentos"
import { useCustomDialog } from "@/hooks/useCustomDialog"
import { Button } from "../ui/button"
import { File, Plus } from "@mynaui/icons-react"
import CustomAlert from "./Dialogs/alert"
import { useCustomAlert } from "@/hooks/useCustomAlert"
import { toast } from "@/hooks/use-toast";
import Link from "next/link"
import { useEffect, useState } from "react"
import { ExtendedZone } from "@/types/ZoneTypes"
import InstrumentoExcelView from "./Views/Excel/InstrumentExcelView"
import { convertToDto } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface CrudInstrumentosProps {
    instrumentos: InstrumentoExtendido[]
    Juzgados: Juzgado[]
    instrumentoTypes: InstrumentoType[],
    zonas: ExtendedZone[]
}

export function CrudInstrumentos({ instrumentos, Juzgados, instrumentoTypes, zonas }: Readonly<CrudInstrumentosProps>) {
    const [instrumentoEditando, setInstrumentoEditando] = useState<InstrumentoExtendido | undefined>(undefined)
    const [instrumentoEliminando, setInstrumentoEliminando] = useState<InstrumentoExtendido | undefined>(undefined)
    const [instrumentosEliminando, setInstrumentosEliminando] = useState<InstrumentoExtendido[]>([])
    const [multipleDelete, setMultipleDelete] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isCreating, setIsCreating] = useState<boolean>(false)

    const { setIsOpen } = useCustomDialog()
    const { setIsOpenAlert } = useCustomAlert()
    const { setJuzgados, setInstrumentoTypes } = useInfoInstrumentos()

    useEffect(() => {
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
        setIsCreating(true)
        try {
            const instrumentoCreado = await createInstrumento(nuevoInstrumento)
            if (!instrumentoCreado) {
                setIsCreating(false)
                return
            }
        } catch (error) {
            toast({
                title: "Error",
                description: (error instanceof Error ? error.message : "Ha ocurrido un error al crear el instrumento"),
                className: "bg-red-500 text-white",
                duration: 3000,
            });
            setIsCreating(false)
            return
        }

        toast({
            title: "Éxito",
            description: "Instrumento creado correctamente",
            className: "bg-green-500 text-white",
            duration: 3000,
        });
        setIsCreating(false)
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
        setMultipleDelete(false)
        setIsOpenAlert(true)
    }

    const onDeleteMultiple = (instrumentos: InstrumentoExtendido[]) => {
        setInstrumentosEliminando(instrumentos)
        setMultipleDelete(true)
        setIsOpenAlert(true)
    }

    const onEditExcel = (instrumento: InstrumentoExtendido) => {
        setInstrumentoEditando(instrumento)
    }

    const handleEditar = async (instrumentoEditado: InstrumentoDTO) => {
        if (!instrumentoEditando) return;
        setIsCreating(true)

        try {
            const instrumentoActualizado = await updateInstrumento(instrumentoEditando.orden.juzgado.identifier, instrumentoEditando.orden.ordenNumber, instrumentoEditado)
            if (!instrumentoActualizado) {
                setIsCreating(false)
                return
            }
        } catch (error) {
            toast({
                title: "Error",
                description: (error instanceof Error ? error.message : "Ha ocurrido un error al editar el instrumento"),
                className: "bg-red-500 text-white",
                duration: 3000,
            });
            setIsCreating(false)
            return
        }

        toast({
            title: "Éxito",
            description: "Instrumento actualizado correctamente",
            className: "bg-green-500 text-white",
            duration: 3000,
        });
        
        setIsCreating(false)
        setIsOpen(false)
        setInstrumentoEditando(undefined)
    }

    const handleEliminar = async () => {
        setIsLoading(true)
        
        if (multipleDelete) {
            // Handle multiple delete
            if (!instrumentosEliminando.length) {
                toast({
                    title: "Error",
                    description: "Ha ocurrido un error al eliminar los instrumentos",
                    className: "bg-red-500 text-white",
                    duration: 3000,
                });
                setIsLoading(false)
                setIsOpenAlert(false)
                return
            }

            let success = true;
            for (const instrumento of instrumentosEliminando) {
                const result = await deleteInstrumento(instrumento.orden.juzgado.identifier, instrumento.orden.ordenNumber);
                if (!result) success = false;
            }

            if (success) {
                toast({
                    title: "Éxito",
                    description: `${instrumentosEliminando.length} instrumentos eliminados correctamente`,
                    className: "bg-green-500 text-white",
                    duration: 3000,
                });
            } else {
                toast({
                    title: "Advertencia",
                    description: "Algunos instrumentos no pudieron ser eliminados",
                    className: "bg-yellow-500 text-white",
                    duration: 3000,
                });
            }
            setInstrumentosEliminando([]);
        } else {
            // Handle single delete
            if (!instrumentoEliminando) {
                toast({
                    title: "Error",
                    description: "Ha ocurrido un error al eliminar el instrumento",
                    className: "bg-red-500 text-white",
                    duration: 3000,
                });
                setIsLoading(false)
                setIsOpenAlert(false)
                return
            }
            const instrumentoEliminado = await deleteInstrumento(instrumentoEliminando.orden.juzgado.identifier, instrumentoEliminando.orden.ordenNumber)
            if (!instrumentoEliminado) {
                setIsLoading(false)
                return
            }
            toast({
                title: "Éxito",
                description: "Instrumento eliminado correctamente",
                className: "bg-green-500 text-white",
                duration: 3000,
            });
            setInstrumentoEditando(undefined)
        }
        setIsLoading(false)
        setIsOpenAlert(false)
    }

    const cancelEliminar = () => {
        setInstrumentoEliminando(undefined)
        setInstrumentosEliminando([])
        setIsOpenAlert(false)
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
                        instrumento={convertToDto(instrumentoEditando, zonas)}
                        zonas={zonas}
                        isLoading={isCreating}
                    />
                }
                customClose={true}
                onClose={handleClose}
            />
            <CustomAlert
                AlertTitle={multipleDelete
                    ? `Eliminar ${instrumentosEliminando.length} instrumentos`
                    : `Eliminar Instrumento ${instrumentoEliminando?.orden.ordenNumber ?? ""} ${instrumentoEliminando?.orden.juzgado.identifier ?? ""}`}
                AlertDescription={multipleDelete
                    ? "¿Estás seguro de que deseas eliminar los instrumentos seleccionados?"
                    : "¿Estás seguro de que deseas eliminar este instrumento?"}
                propAlertDialogContent={
                    <div className="flex flex-row justify-center gap-4">
                        <Button
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => handleEliminar()}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Procesando...
                                </>
                            ) : (
                                "Eliminar"
                            )}
                        </Button>
                        <Button
                            className="bg-blue-500 hover:bg-blue-600"
                            onClick={() => cancelEliminar()}
                            disabled={isLoading}
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
                        className="bg-blue-500 hover:bg-blue-600 w-full"
                    >
                        Cargar instrumentos por PDF
                        <File className="h-4 w-4 text-white" />
                    </Button>
                </Link>
            </div>

            <div className="flex flex-grow overflow:hidde justify-center gap-4">
                <InstrumentoExcelView
                    data={instrumentos}
                    saveChanges={handleEditar}
                    onEdit={onEditExcel}
                    onDelete={onDelete}
                    onDeleteMultiple={onDeleteMultiple}
                    Juzgados={Juzgados}
                    instrumentoTypes={instrumentoTypes}
                    onEditDialog={onEdit}
                    zonas={zonas}
                />
            </div>
        </div>
    )
}



