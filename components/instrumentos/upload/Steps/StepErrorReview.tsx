import { Button } from "@/components/ui/button";
import { useCustomDialog } from "@/hooks/useCustomDialog";
import { InstrumentoDTO, InstrumentoDtoWithError } from "@/types/instrumentoTypes";
import { ChevronLeftIcon, ChevronRightIcon, FileIcon, TableIcon, ListIcon, CheckIcon, XIcon } from "lucide-react";
import CustomDialog from "../../Dialogs/dialog";
import { FormularioInstrumento } from "../../Forms/formulario-instrumento";
import { useEffect, useState } from "react";
import { getInstrumentTypes, getJuzgados } from "@/actions/instrumentos-actions";
import { EstadoInstrumento, InstrumentoType, Juzgado, UrgenciaInstrumento, TipoCarga } from "@prisma/client";
import { useCustomAlert } from "@/hooks/useCustomAlert";
import CustomAlert from "../../Dialogs/alert";
import { Delete, Edit, Save } from "@mynaui/icons-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddressAutocomplete from "@/components/planificador-de-ruta/addresAutoComplete";

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

    // Estado para controlar el tipo de vista
    const [viewMode, setViewMode] = useState<'list' | 'excel'>('list');

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

    const handleInputChange = (field: keyof InstrumentoDTO, value: any) => {
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
        <div className="flex flex-col w-full gap-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">Datos procesados</h2>
                {errors.length > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Vista:</span>
                        <Button
                            variant={viewMode === 'list' ? "default" : "outline"}
                            size="sm"
                            className={viewMode === 'list' ? "bg-blue-500 hover:bg-blue-600" : ""}
                            onClick={() => setViewMode('list')}
                        >
                            <ListIcon className="h-4 w-4 mr-1" />
                            Lista
                        </Button>
                        <Button
                            variant={viewMode === 'excel' ? "default" : "outline"}
                            size="sm"
                            className={viewMode === 'excel' ? "bg-green-500 hover:bg-green-600" : ""}
                            onClick={() => setViewMode('excel')}
                        >
                            <TableIcon className="h-4 w-4 mr-1" />
                            Excel
                        </Button>
                    </div>
                )}
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

            {errors.length > 0 && viewMode === 'list' && (
                <ErrorList
                    title="Información incompleta"
                    instrumentErrors={errors}
                    handleSetInstrumentoEditando={handleSetInstrumentoEditando}
                    onCancelarCarga={onCancelarCarga}
                />
            )}

            {errors.length > 0 && viewMode === 'excel' && (
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
                />
            )}

            {errors.length === 0 && (
                <div className="bg-green-100 p-4 rounded-lg">
                    <p className="text-green-600">No se han encontrado errores en los datos procesados</p>
                </div>
            )}

            <div className="flex justify-between mt-6">
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

interface ErrorListProps {
    title: string;
    instrumentErrors: InstrumentoDtoWithError[];
    handleSetInstrumentoEditando: (instrumento: InstrumentoDTO) => void;
    onCancelarCarga: (instrumento: InstrumentoDTO) => void;
}

/** Error List Component */
function ErrorList({ title, instrumentErrors, handleSetInstrumentoEditando, onCancelarCarga }: Readonly<ErrorListProps>) {
    return (
        <div className="flex flex-col gap-6 p-4 bg-red-50 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-red-700 border-b border-red-300 pb-2">{title}</h3>
            <ul className="space-y-4">
                {instrumentErrors.map((error, index) => (
                    <li
                        key={"Instrument_with_errors" + index}
                        className="flex flex-col gap-3 bg-red-100 p-4 rounded-lg shadow-sm border border-red-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <FileIcon className="h-6 w-6 text-red-600" />
                            <span className="text-base font-medium text-gray-900">{error.caratula}</span>
                        </div>
                        <div className="flex flex-col gap-3 ">
                            <div className="flex flex-row items-center gap-2">
                                <Edit className="h-6 w-6 text-red-600" />
                                <span className="text-sm font-medium text-red-600">Ocurrieron los siguientes errores:</span>
                                <span className="text-sm font-medium text-red-600">{error.error}</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                {
                                    error.error === "Juzgado y tipo de instrumento inválidos" && (
                                        <>
                                            <span className="text-sm font-medium text-red-600">
                                                Juzgado en pdf: {error.juzgadoIdentifier}
                                            </span><span className="text-sm font-medium text-red-600">
                                                Tipo de instrumento en pdf: {error.instrumentoTypeIdentifier}
                                            </span>
                                        </>
                                    )
                                }
                                {
                                    error.error === "Tipo de instrumento inválido" && (
                                        <span className="text-sm font-medium text-red-600">
                                            Tipo de instrumento en pdf: {error.instrumentoTypeIdentifier}
                                        </span>
                                    )
                                }
                                {
                                    error.error === "Juzgado inválido" && (
                                        <span className="text-sm font-medium text-red-600">
                                            Juzgado en pdf: {error.juzgadoIdentifier}
                                        </span>
                                    )
                                }
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row md:justify-between gap-2">
                            <Button
                                className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
                                onClick={() => handleSetInstrumentoEditando(error)}
                            >
                                Completar Información
                            </Button>
                            <Button
                                className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
                                onClick={() => onCancelarCarga(error)}
                            >
                                Cancelar Carga
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

interface ErrorExcelViewProps extends ErrorListProps {
    juzgados: Juzgado[];
    instrumentoTypes: InstrumentoType[];
    editingIndex: number | null;
    editedData: InstrumentoDTO | null;
    startEditing: (index: number) => void;
    handleInputChange: (field: keyof InstrumentoDTO, value: any) => void;
    saveEditedData: () => void;
    cancelEditing: () => void;
}

/** Error Excel View Component with Inline Editing */
function ErrorExcelView({
    title,
    instrumentErrors,
    onCancelarCarga,
    juzgados,
    instrumentoTypes,
    editingIndex,
    editedData,
    startEditing,
    handleInputChange,
    saveEditedData,
    cancelEditing
}: Readonly<ErrorExcelViewProps>) {
    return (
        <div className="flex flex-col w-full gap-6 p-4 bg-white rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2">{title}</h3>

            <div className="w-full">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-3 py-2 border border-gray-300 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Carátula</th>
                            <th className="px-3 py-2 border border-gray-300 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Error</th>
                            <th className="px-3 py-2 border border-gray-300 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Juzgado</th>
                            <th className="px-3 py-2 border border-gray-300 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tipo de Instrumento</th>
                            <th className="px-3 py-2 border border-gray-300 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Fecha Ingreso</th>
                            <th className="px-3 py-2 border border-gray-300 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Urgencia</th>
                            <th className="px-3 py-2 border border-gray-300 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Domicilio</th>
                            <th className="px-3 py-2 border border-gray-300 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Observaciones</th>
                            <th className="px-3 py-2 border border-gray-300 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {instrumentErrors.map((error, index) => (
                            <tr key={"excel_row_" + index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                {editingIndex === index && editedData ? (
                                    // Modo edición
                                    <>
                                        <td className="px-3 py-2 border border-gray-300">
                                            <Input
                                                value={editedData.caratula}
                                                onChange={(e) => handleInputChange('caratula', e.target.value)}
                                                className="w-full text-sm"
                                            />
                                        </td>
                                        <td className="px-3 py-2 border border-gray-300 text-sm text-red-600 font-medium">
                                            {error.error}
                                        </td>
                                        <td className="px-3 py-2 border border-gray-300">
                                            <Select
                                                value={editedData.juzgadoIdentifier}
                                                onValueChange={(value) => handleInputChange('juzgadoIdentifier', value)}
                                            >
                                                <SelectTrigger className="w-full text-sm">
                                                    <SelectValue placeholder="Seleccionar juzgado" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {juzgados.map((juzgado) => (
                                                        <SelectItem key={juzgado.identifier} value={juzgado.identifier}>
                                                            {juzgado.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        <td className="px-3 py-2 border border-gray-300">
                                            <Select
                                                value={editedData.instrumentoTypeIdentifier}
                                                onValueChange={(value) => handleInputChange('instrumentoTypeIdentifier', value)}
                                            >
                                                <SelectTrigger className="w-full text-sm">
                                                    <SelectValue placeholder="Seleccionar tipo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {instrumentoTypes.map((type) => (
                                                        <SelectItem key={type.identifier} value={type.identifier}>
                                                            {type.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        <td className="px-3 py-2 border border-gray-300">
                                            <Input
                                                type="date"
                                                value={editedData.fecha_de_ingreso ? new Date(editedData.fecha_de_ingreso).toISOString().split('T')[0] : ''}
                                                onChange={(e) => handleInputChange('fecha_de_ingreso', new Date(e.target.value))}
                                                className="w-full text-sm"
                                            />
                                        </td>
                                        <td className="px-3 py-2 border border-gray-300">
                                            <Select
                                                value={editedData.urgencia}
                                                onValueChange={(value) => handleInputChange('urgencia', value)}
                                            >
                                                <SelectTrigger className="w-full text-sm">
                                                    <SelectValue placeholder="Urgencia" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={UrgenciaInstrumento.NORMAL}>Normal</SelectItem>
                                                    <SelectItem value={UrgenciaInstrumento.URGENTE}>Urgente</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        <td className="px-3 py-2 border border-gray-300">
                                            <AddressAutocomplete
                                                defaultValue={editedData.domicilio_denunciado || ''}
                                                onChange={(value) => handleInputChange('domicilio_denunciado', value)}
                                                miUbicacion={false}
                                            />
                                        </td>
                                        <td className="px-3 py-2 border border-gray-300">
                                            <Input
                                                value={editedData.observaciones || ''}
                                                onChange={(e: { target: { value: any; }; }) => handleInputChange('observaciones', e.target.value)}
                                                className="w-full text-sm"

                                            />
                                        </td>
                                        <td className="px-3 py-2 border border-gray-300">
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    size="sm"
                                                    className="bg-green-500 hover:bg-green-600 text-white text-xs"
                                                    onClick={saveEditedData}
                                                >
                                                    <CheckIcon className="h-3 w-3 mr-1" />
                                                    Guardar
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="bg-gray-500 hover:bg-gray-600 text-white text-xs"
                                                    onClick={cancelEditing}
                                                >
                                                    <XIcon className="h-3 w-3 mr-1" />
                                                    Cancelar
                                                </Button>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    // Modo visualización
                                    <>
                                        <td className="px-3 py-2 border border-gray-300 text-sm text-gray-900">{error.caratula}</td>
                                        <td className="px-3 py-2 border border-gray-300 text-sm text-red-600 font-medium">{error.error}</td>
                                        <td className={`px-3 py-2 border border-gray-300 text-sm ${error.error.includes("Juzgado") ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                                            {error.juzgadoIdentifier || 'N/A'}
                                        </td>
                                        <td className={`px-3 py-2 border border-gray-300 text-sm ${error.error.includes("tipo de instrumento") ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                                            {error.instrumentoTypeIdentifier || 'N/A'}
                                        </td>
                                        <td className="px-3 py-2 border border-gray-300 text-sm text-gray-900">
                                            {error.fecha_de_ingreso ? new Date(error.fecha_de_ingreso).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-3 py-2 border border-gray-300 text-sm text-gray-900">
                                            {error.urgencia || UrgenciaInstrumento.NORMAL}
                                        </td>
                                        <td className="px-3 py-2 border border-gray-300 text-sm text-gray-900">
                                            {error.domicilio_denunciado || 'N/A'}
                                        </td>
                                        <td className="px-3 py-2 border border-gray-300 text-sm text-gray-900">
                                            {error.observaciones || 'N/A'}
                                        </td>
                                        <td className="px-3 py-2 border border-gray-300">
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    size="sm"
                                                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs"
                                                    onClick={() => startEditing(index)}
                                                >
                                                    <Edit className="h-3 w-3 mr-1" />
                                                    Editar
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="bg-red-500 hover:bg-red-600 text-white text-xs"
                                                    onClick={() => onCancelarCarga(error)}
                                                >
                                                    <Delete className="h-3 w-3 mr-1" />
                                                    Cancelar
                                                </Button>
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                <p className="text-sm text-gray-600">
                    <span className="font-medium">Total de registros con errores:</span> {instrumentErrors.length}
                </p>
            </div>
        </div>
    );
}