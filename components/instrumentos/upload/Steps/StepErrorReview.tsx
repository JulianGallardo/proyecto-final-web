import { Button } from "@/components/ui/button";
import { useCustomDialog } from "@/hooks/useCustomDialog";
import { InstrumentoDTO, InstrumentoExtendido, InstrumentPDFDTO } from "@/types/instrumento";
import { ChevronLeftIcon, ChevronRightIcon, FileIcon } from "lucide-react";
import CustomDialog from "../../Dialogs/dialog";
import { FormularioInstrumento } from "../../Forms/formulario-instrumento";
import { useEffect, useState } from "react";
import { getInstrumentoExtendido, getInstrumentTypes, getJuzgados } from "@/actions/instrumentos-actions";
import { InstrumentoType, Juzgado } from "@prisma/client";

export default function StepErrorReview({
    data,
    errors,
    onBack,
    onNext
}: Readonly<{
    data: InstrumentoDTO[];
    errors: { juzgadoErrors: InstrumentoDTO[]; typeErrors: InstrumentoDTO[] };
    onBack: () => void;
    onNext: () => void;
}>) {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">Datos procesados</h2>

            {errors.juzgadoErrors.length > 0 && (
                <ErrorList
                    title="Errores de juzgado"
                    instrumentErrors={errors.juzgadoErrors}
                />
            )}

            {errors.typeErrors.length > 0 && (
                <ErrorList
                    title="Errores de tipo de instrumento"
                    instrumentErrors={errors.typeErrors}
                />
            )}

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
                    disabled={errors.juzgadoErrors.length > 0 || errors.typeErrors.length > 0}
                    onClick={onNext}
                >
                    Siguiente paso
                    <ChevronRightIcon className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

/** Error List Component */
function ErrorList({ title, instrumentErrors }: Readonly<{ title: string; instrumentErrors: InstrumentoDTO[] }>) {




    const {setIsOpen} = useCustomDialog();
    const [instrumentoEditando, setInstrumentoEditando] = useState<InstrumentoExtendido | undefined>(undefined);
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
        setIsOpen(false);
    }

    const handleEditar = (data: InstrumentoExtendido) => {
        console.log(data);
    }
    

    const handleSetInstrumentoEditando = (instrumento: InstrumentoDTO) => {
        getInstrumentoExtendido(instrumento).then(instrumentoExtendido => {
            const extendedInstrumento: InstrumentoExtendido = {
                ...instrumentoExtendido,
                createdAt: new Date(),
                updatedAt: new Date(),
                ordenNumber: 0,
                juzgadoId: 0,
                instrumentoTypeId: 0,
                deleted: false,
                deletedAt: null,
                // Add other missing properties with default values
            };

        
            setInstrumentoEditando(extendedInstrumento);

            
            setIsOpen(true);
        });
    }






    return (
        <div className="flex flex-col gap-4">
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
            <h3 className="text-lg font-semibold text-red-600">{title}</h3>
            <ul className="space-y-2">
                {instrumentErrors.map((error, index) => (
                    <li key={index} className="flex flex-col bg-red-100 p-3 rounded-lg">
                        <div className="flex flex-row items-center gap-2">
                            <FileIcon className="h-5 w-5 text-red-500" />
                            <span className="text-sm text-gray-800 font-medium">{error.caratula}</span>

                        </div>
                        <Button
                            className="bg-blue-500 hover:bg-blue-600"
                            onClick={() => {
                                 handleSetInstrumentoEditando(error);
                            }}
                        >
                            Completar Información
                        </Button>

                    </li>
                ))}
            </ul>
        </div>
    );
}