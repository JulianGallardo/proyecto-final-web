import { getInstrumentTypes, getJuzgados } from "@/actions/instrumentos-actions";
import { Button } from "@/components/ui/button";
import { useCustomDialog } from "@/hooks/useCustomDialog";
import { InstrumentoDTO } from "@/types/instrumentoTypes";
import { InstrumentoType, Juzgado } from "@prisma/client";
import { FileIcon, ChevronLeftIcon, ChevronRightIcon, ListIcon, TableIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { FormularioInstrumento } from "../../Forms/formulario-instrumento";
import CustomDialog from "../../Dialogs/dialog";
import { Accordion } from "@/components/ui/accordion";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion";
import { ArrowDown } from "@mynaui/icons-react";
import { parseDate } from "@/lib/utils";
import CustomAlert from "../../Dialogs/alert";
import { useCustomAlert } from "@/hooks/useCustomAlert";
import { toast } from "@/hooks/use-toast";
import ExcelDataView from "../Views/ExcelView/ExcelDataView";


const ITEMS_PER_PAGE = 10;

export default function StepDataReview({
    deleteInstrumentData,
    editInstrumentData,
    data,
    currentPage,
    totalPages,
    onNextPage,
    onPrevPage,
    onBack,
    onConfirm
}: Readonly<{
    deleteInstrumentData: (instrumento: InstrumentoDTO) => void;
    editInstrumentData: (instrumento: InstrumentoDTO) => void;
    data: InstrumentoDTO[];
    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPrevPage: () => void;
    onBack: () => void;
    onConfirm: () => void;
}>) {

    const paginatedData = data.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const { setIsOpen } = useCustomDialog();
    const { setIsOpenAlert } = useCustomAlert();
    const [instrumentoEditando, setInstrumentoEditando] = useState<InstrumentoDTO | undefined>(undefined);
    const [instrumentoCancelando, setInstrumentoCancelando] = useState<InstrumentoDTO | undefined>(undefined);
    const [viewMode, setViewMode] = useState<'list' | 'excel'>('list');

    const [instrumentoTypes, setInstrumentoTypes] = useState<InstrumentoType[]>([]);
    const [juzgados, setJuzgados] = useState<Juzgado[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editedData, setEditedData] = useState<InstrumentoDTO | null>(null);

    // Funciones para manejar la edición en la vista Excel
    const startEditing = (index: number) => {
        setEditingIndex(index);
        setEditedData({ ...paginatedData[index] });
    };

    const handleInputChange = (field: keyof InstrumentoDTO, value: any) => { // eslint-disable-line
        if (editedData) {
            setEditedData({
                ...editedData,
                [field]: value
            });
        }
    };

    const saveEditedData = () => {
        if (editedData) {
            editInstrumentData(editedData);
            setEditingIndex(null);
            setEditedData(null);
        }
    };

    const cancelEditing = () => {
        setEditingIndex(null);
        setEditedData(null);
    };

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

    useEffect(() => {
        if (data.length === 0) {
            toast({
                title: "Error",
                description: "No hay instrumentos disponibles para cargar, volviendo atras...",
                className: "bg-red-500 text-white",
                duration: 3000,
            });
            onBack();
        }
    }, [data])


    const handleClose = () => {
        setInstrumentoEditando(undefined);
        setIsOpen(false);
    }

    const handleEditar = async (newData: InstrumentoDTO): Promise<void> => {
        editInstrumentData(newData);
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


    const handleEliminar = () => {
        if (!instrumentoCancelando) return;
        deleteInstrumentData(instrumentoCancelando);
        setIsOpenAlert(false);
    }

    const cancelEliminar = () => {
        setInstrumentoCancelando(undefined);
        setIsOpenAlert(false);
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

            <CustomAlert
                AlertTitle={"Cancelar Carga"}
                AlertDescription="¿Estás seguro de que deseas cancelar la carga del instrumento?"
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

            <div className="flex flex-col md:flex-row md:justify-between items-center gap-2 mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Datos procesados</h2>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 hidden md:inline">Vista:</span>
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
            </div>
            <div className="flex flex-col gap-4 w-full">

                {
                    viewMode === 'list' &&
                    paginatedData.map((item, index) => (
                        <InstrumentoDataView key={index} instrumento={item} handleSetInstrumentoEditando={handleSetInstrumentoEditando} onCancel={onCancelarCarga} />
                    ))
                }
                {viewMode === 'excel' &&
                    <ExcelDataView
                        data={paginatedData}
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
                }


            </div>
            <div className="flex items-center justify-between mt-4">
                <Button variant="outline" onClick={onPrevPage} disabled={currentPage === 1}>
                    <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">Página {currentPage} de {totalPages}</span>
                <Button variant="outline" onClick={onNextPage} disabled={currentPage === totalPages}>
                    <ChevronRightIcon className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex justify-between mt-6">
                <Button className="bg-blue-500 hover:bg-blue-600" onClick={onBack}>
                    <ChevronLeftIcon className="h-4 w-4" />
                    Volver
                </Button>
                <Button className="bg-green-500 hover:bg-green-600" onClick={onConfirm}>
                    Confirmar carga
                    <ChevronRightIcon className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

function InstrumentoDataView({ instrumento, handleSetInstrumentoEditando, onCancel }: Readonly<{ instrumento: InstrumentoDTO, handleSetInstrumentoEditando: (instrumento: InstrumentoDTO) => void, onCancel: (instrumento: InstrumentoDTO) => void }>) {
    return (
        <div className="flex flex-col items-center gap-4 p-4 bg-white shadow-lg rounded-2xl w-full  border border-gray-200">
            <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg w-full">
                <FileIcon className="h-6 w-6 text-blue-600" />
                <span className="text-base text-gray-900 font-semibold">{instrumento.caratula}</span>
            </div>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-none">
                    <AccordionTrigger className="flex items-center justify-between w-full p-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all">
                        <span className="text-sm font-medium">Detalles</span>
                        <ArrowDown className="h-4 w-4 text-gray-500" />
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-3">
                        <div className="flex flex-col gap-3 p-2">
                            <span className="text-sm text-gray-700"><strong>Juzgado:</strong> {instrumento.juzgadoIdentifier}</span>
                            <span className="text-sm text-gray-700"><strong>Tipo de instrumento:</strong> {instrumento.instrumentoTypeIdentifier}</span>
                            <span className="text-sm text-gray-700"><strong>Fecha de ingreso:</strong> {parseDate(instrumento.fecha_de_ingreso.toISOString())}</span>
                            <span className="text-sm text-gray-700"><strong>Fecha de salida:</strong> {instrumento.fecha_de_salida ? parseDate(instrumento.fecha_de_salida.toISOString()) : "Sin fecha"}</span>
                            <span className="text-sm text-gray-700"><strong>Domicilio Denunciado:</strong> {instrumento.domicilio_denunciado}</span>
                            <span className="text-sm text-gray-700"><strong>Codigo:</strong> {instrumento.codigo}</span>

                            <div className="flex flex-col md:flex-row md:justify-between gap-2">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-all" onClick={() => handleSetInstrumentoEditando(instrumento)}>
                                    Modificar información
                                </Button>
                                <Button className="w-full bg-red-600 hover:bg-red-700 transition-all" onClick={() => onCancel(instrumento)}>
                                    Cancelar Carga
                                </Button>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}


