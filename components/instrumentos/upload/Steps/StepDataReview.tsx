import { getInstrumentTypes, getJuzgados } from "@/actions/instrumentos-actions";
import { Button } from "@/components/ui/button";
import { useCustomDialog } from "@/hooks/useCustomDialog";
import { InstrumentoDTO } from "@/types/instrumentoTypes";
import { InstrumentoType, Juzgado } from "@prisma/client";
import {  ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { FormularioInstrumento } from "../../Forms/formulario-instrumento";
import CustomDialog from "../../Dialogs/dialog";

import CustomAlert from "../../Dialogs/alert";
import { useCustomAlert } from "@/hooks/useCustomAlert";
import { toast } from "@/hooks/use-toast";
import ExcelDataView from "../Views/ExcelView/ExcelDataView";
import { ExtendedZone } from "@/types/ZoneTypes";
import { getAll } from "@/actions/zone-actions";


const ITEMS_PER_PAGE = 10;

export default function StepDataReview({
    deleteInstrumentData,
    editInstrumentData,
    data,
    onBack,
    onConfirm
}: Readonly<{
    deleteInstrumentData: (instrumento: InstrumentoDTO) => void;
    editInstrumentData: (instrumento: InstrumentoDTO) => void;
    data: InstrumentoDTO[];
    onBack: () => void;
    onConfirm: () => void;
}>) {

    
    const { setIsOpen } = useCustomDialog();
    const { setIsOpenAlert } = useCustomAlert();
    const [instrumentoEditando, setInstrumentoEditando] = useState<InstrumentoDTO | undefined>(undefined);
    const [instrumentoCancelando, setInstrumentoCancelando] = useState<InstrumentoDTO | undefined>(undefined);

    const [instrumentoTypes, setInstrumentoTypes] = useState<InstrumentoType[]>([]);
    const [juzgados, setJuzgados] = useState<Juzgado[]>([]);
    const [zonas, setZonas] = useState<ExtendedZone[]>([]); // Cambia el tipo según tu necesidad
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editedData, setEditedData] = useState<InstrumentoDTO | null>(null);

    // Funciones para manejar la edición en la vista Excel
    const startEditing = (index: number) => {
        setEditingIndex(index);
        setEditedData(data[index]);
    };

    const handleInputChange = (field: keyof InstrumentoDTO, value: any) => { // eslint-disable-line
        setEditedData((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                [field]: value
            };
        });
    };


    const saveEditedData = () => {
        if (editedData) {
            editInstrumentData(editedData);

            setEditedData(null);
            setEditingIndex(null);
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

        const fetchZonas = async () => {
            const zonasFetch = await getAll();
            setZonas(zonasFetch);
        }

        fetchInstrumentoTypes();
        fetchJuzgados();
        fetchZonas();
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
        cancelEditing();
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

            </div>
            <div className="flex flex-col gap-4 w-full">


                <ExcelDataView
                    data={data}
                    onCancelarCarga={onCancelarCarga}
                    juzgados={juzgados}
                    instrumentoTypes={instrumentoTypes}
                    editingIndex={editingIndex}
                    editedData={editedData}
                    startEditing={startEditing}
                    handleInputChange={handleInputChange}
                    saveEditedData={saveEditedData}
                    cancelEditing={cancelEditing}
                    zonas={zonas}
                    onEditDialog={handleSetInstrumentoEditando}

                />


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



