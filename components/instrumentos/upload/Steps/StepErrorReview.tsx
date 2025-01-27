import { Button } from "@/components/ui/button";
import { useCustomDialog } from "@/hooks/useCustomDialog";
import { InstrumentoDTO, InstrumentoExtendido, InstrumentPDFDTO } from "@/types/instrumentoTypes";
import { ChevronLeftIcon, ChevronRightIcon, FileIcon } from "lucide-react";
import CustomDialog from "../../Dialogs/dialog";
import { FormularioInstrumento } from "../../Forms/formulario-instrumento";
import { useEffect, useState } from "react";
import { getInstrumentoExtendido, getInstrumentTypes, getJuzgados } from "@/actions/instrumentos-actions";
import { InstrumentoType, Juzgado } from "@prisma/client";

export default function StepErrorReview({
    editInstrumentDataError,
    errors,
    onBack,
    onNext
}: Readonly<{
    editInstrumentDataError: (instrumento: InstrumentoDTO) => void;
    errors: InstrumentoDTO[];
    onBack: () => void;
    onNext: () => void;
}>) {



    const { setIsOpen } = useCustomDialog();
    const [instrumentoEditando, setInstrumentoEditando] = useState<InstrumentoDTO | undefined>(undefined);
    const [instrumentoTypes, setInstrumentoTypes] = useState<InstrumentoType[]>([]);
    const [juzgados, setJuzgados] = useState<Juzgado[]>([]);

    useEffect(() => {
        const fetchInstrumentoTypes = async () => {
            const instrumentoTypes = await getInstrumentTypes();
            setInstrumentoTypes(instrumentoTypes);
        }

        const fetchJuzgados = async () => {
            const juzgadosFetch = await getJuzgados();
            setJuzgados(juzgadosFetch);
        }

        fetchInstrumentoTypes();
        fetchJuzgados();
    }, []);


    const handleClose = () => {
        setInstrumentoEditando(undefined);
        setIsOpen(false);
    }

    const handleEditar = (newData: InstrumentoDTO) => {
        editInstrumentDataError(newData);
        setIsOpen(false);
        
    }


    const handleSetInstrumentoEditando = (instrumento: InstrumentoDTO) => {
        setInstrumentoEditando(instrumento);
        setIsOpen(true);
    }


    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">Datos procesados</h2>

            <CustomDialog
                dialogTitle={"Completar Información"}
                dialogDescription={"Completa la información del instrumento faltante"}
                propDialogContent={
                    <FormularioInstrumento
                        instrumentoTypes={instrumentoTypes}
                        Juzgados={juzgados}
                        onSubmit={handleEditar}
                        instrumento={instrumentoEditando}
                    />
                }
                customClose={true}
                onClose={handleClose}
            />

            {errors.length > 0 && (
                <ErrorList
                    title="Información incompleta"
                    instrumentErrors={errors}
                    handleSetInstrumentoEditando={handleSetInstrumentoEditando}

                />
            )}

            {
                errors.length === 0 && (
                    <div className="bg-green-100 p-4 rounded-lg">
                        <p className="text-green-600">No se han encontrado errores en los datos procesados</p>
                    </div>
                )
            }

            <div className="flex justify-between mt-6">
                <Button
                    className="bg-blue-500 hover:bg-blue-600"
                    onClick={onBack}
                >
                    <ChevronLeftIcon className="h-4 w-4" />
                    Volver
                </Button>
                <Button
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300"
                    disabled={errors.length > 0 }
                    onClick={onNext}
                >
                    Siguiente paso
                    <ChevronRightIcon className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

interface ErrorListProps {
    title: string;
    instrumentErrors: InstrumentoDTO[];
    handleSetInstrumentoEditando: (instrumento: InstrumentoDTO) => void;
}

/** Error List Component */
function ErrorList({ title, instrumentErrors,handleSetInstrumentoEditando }: Readonly<ErrorListProps>) {











    return (
        <div className="flex flex-col gap-4">

            <h3 className="text-lg font-semibold text-red-600">{title}</h3>
            <ul className="space-y-2">
                {instrumentErrors.map((error, index,) => (
                    <li key={index} className="flex flex-col bg-red-100 p-3 rounded-lg">
                        <div className="flex flex-row items-center gap-2">
                            <FileIcon className="h-5 w-5 text-red-500" />
                            <span className="text-sm text-gray-800 font-medium">{error.caratula}</span>

                        </div>
                        <Button
                            className="bg-blue-500 hover:bg-blue-600 w-fit"
                            onClick={() => handleSetInstrumentoEditando(error)}

                        >
                            Completar Información
                        </Button>

                    </li>
                ))}
            </ul>
        </div>
    );
}



