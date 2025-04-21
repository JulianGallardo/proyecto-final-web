import { Button } from "@/components/ui/button";
import { useCustomDialog } from "@/hooks/useCustomDialog";
import { InstrumentoDTO, InstrumentoDtoWithError } from "@/types/instrumentoTypes";
import { ChevronLeftIcon, ChevronRightIcon, } from "lucide-react";
import CustomDialog from "../../Dialogs/dialog";
import { FormularioInstrumento } from "../../Forms/formulario-instrumento";
import { useEffect, useState } from "react";
import { getInstrumentTypes, getJuzgados } from "@/actions/instrumentos-actions";
import { EstadoInstrumento, InstrumentoType, Juzgado} from "@prisma/client";
import { useCustomAlert } from "@/hooks/useCustomAlert";
import CustomAlert from "../../Dialogs/alert";
import { Delete} from "@mynaui/icons-react";
import ErrorExcelView from "../Views/ExcelView/ExcelErrorView";

export default function StepErrorReview({
    deleteInstrumento,
    editInstrumentDataError,
    deleteAllErrors,
    errors,
    onBack,
    onNext
}: Readonly<{
    deleteInstrumento: (instrumento: InstrumentoDTO) => void;
    editInstrumentDataError: (instrumento: InstrumentoDTO) => void;
    deleteAllErrors: () => void;
    errors: InstrumentoDtoWithError[];
    onBack: () => void;
    onNext: () => void;
}>) {

    const { setIsOpen } = useCustomDialog();
    const { setIsOpenAlert } = useCustomAlert();


    const [instrumentoEditando, setInstrumentoEditando] = useState<InstrumentoDTO | undefined>(undefined);
    const [instrumentoCancelando, setInstrumentoCancelando] = useState<InstrumentoDTO | undefined>(undefined);

    const [instrumentoTypes, setInstrumentoTypes] = useState<InstrumentoType[]>([]);
    const [juzgados, setJuzgados] = useState<Juzgado[]>([]);

    // Para la edición inline en modo Excel
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editedData, setEditedData] = useState<InstrumentoDTO | null>(null);

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

    const handleEditar = async (newData: InstrumentoDTO): Promise<void> => {
        editInstrumentDataError(newData);
        setIsOpen(false);
    }

    const handleSetInstrumentoEditando = (instrumento: InstrumentoDTO) => {
        setInstrumentoEditando(instrumento);
        setIsOpen(true);
    }

    const onCancelarCarga = (instrumento: InstrumentoDTO) => {
        setInstrumentoCancelando(instrumento);
        setIsOpenAlert(true);
    }

    const handleCancelarCarga = () => {
        if (!instrumentoCancelando) {
            deleteAllErrors();
        }
        else {
            deleteInstrumento(instrumentoCancelando);
        }
        setIsOpenAlert(false);
    }

    const cancelCancelarCarga = () => {
        setInstrumentoCancelando(undefined);
        setIsOpenAlert(false);
    }

    const onCancelarCargaTodos = () => {
        setIsOpenAlert(true);
    }

    const onNextStep = () => {
        errors.forEach((error) => {
            let juzgado = error.juzgadoIdentifier;
            let instrumentoType = error.instrumentoTypeIdentifier;

            if (error.error === "Juzgado y tipo de instrumento inválidos") {
                juzgado = "No encontrado";
                instrumentoType = "No nomenclado";
            }
            else if (error.error === "Juzgado inválido") {
                juzgado = "No encontrado";
            }
            else
                instrumentoType = "No nomenclado";
            const newData = {
                ...error,
                juzgadoIdentifier: juzgado,
                instrumentoTypeIdentifier: instrumentoType,
                estado: EstadoInstrumento.CORRECCIONES_SOLICITADAS
            }

            editInstrumentDataError(newData);
        });
        onNext();
    }

    // Funciones para la edición inline en la vista Excel
    const startEditing = (index: number) => {
        setEditingIndex(index);
        setEditedData({ ...errors[index] });
    }

    const handleInputChange = (field: keyof InstrumentoDTO, value: any) => { // eslint-disable-line
        if (editedData) {
            setEditedData({
                ...editedData,
                [field]: value
            });
        }
    }

    const saveEditedData = () => {
        if (editedData) {
            editInstrumentDataError(editedData);
            setEditingIndex(null);
            setEditedData(null);
        }
    }

    const cancelEditing = () => {
        setEditingIndex(null);
        setEditedData(null);
    }

    return (
        <div className="flex flex-col w-full gap-4 ">
            <div className="flex flex-col md:flex-row md:justify-between items-center gap-2">
                <h2 className="text-2xl font-semibold text-gray-800">Datos procesados</h2>
                
            </div>

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

            <CustomAlert
                AlertTitle={"Cancelar Carga"}
                AlertDescription={instrumentoCancelando ? `¿Estás seguro de que deseas cancelar la carga del instrumento ${instrumentoCancelando.caratula}?` : "¿Estás seguro de que deseas cancelar la carga de todos los instrumentos?"}
                propAlertDialogContent={
                    <div className="flex flex-row justify-center gap-4">
                        <Button
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => handleCancelarCarga()}
                        >
                            Eliminar
                        </Button>
                        <Button
                            className="bg-blue-500 hover:bg-blue-600"
                            onClick={() => cancelCancelarCarga()}
                        >
                            Cancelar
                        </Button>
                    </div>
                }
            />

            

            {errors.length > 0  && (
                <ErrorExcelView
                    title="Información incompleta"
                    instrumentErrors={errors}
                    handleSetInstrumentoEditando={handleSetInstrumentoEditando}
                    onCancelarCarga={onCancelarCarga}
                    juzgados={juzgados}
                    instrumentoTypes={instrumentoTypes}
                    editingIndex={editingIndex}
                    editedData={editedData}
                    startEditing={startEditing}
                    handleInputChange={handleInputChange}
                    saveEditedData={saveEditedData}
                    cancelEditing={cancelEditing}
                    onEditDialog={handleSetInstrumentoEditando}
                />
            )}

            {errors.length === 0 && (
                <div className="bg-green-100 p-4 rounded-lg">
                    <p className="text-green-600">No se han encontrado errores en los datos procesados</p>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-2 justify-between mt-6">
                <Button
                    className="bg-blue-500 hover:bg-blue-600"
                    onClick={onBack}
                >
                    <ChevronLeftIcon className="h-4 w-4" />
                    Volver
                </Button>
                {errors.length > 1 &&
                    <Button
                        className="bg-red-500 hover:bg-red-600"
                        onClick={onCancelarCargaTodos}
                    >
                        Cancelar todos
                        <Delete className="h-4 w-4" />
                    </Button>
                }
                <Button
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300"
                    onClick={onNextStep}
                >
                    Siguiente paso
                    <ChevronRightIcon className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}


