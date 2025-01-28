import { getInstrumentTypes, getJuzgados } from "@/actions/instrumentos-actions";
import { Button } from "@/components/ui/button";
import { useCustomDialog } from "@/hooks/useCustomDialog";
import { InstrumentoDTO, InstrumentPDFDTO } from "@/types/instrumentoTypes";
import { InstrumentoType, Juzgado } from "@prisma/client";
import { FileIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { FormularioInstrumento } from "../../Forms/formulario-instrumento";
import CustomDialog from "../../Dialogs/dialog";


const ITEMS_PER_PAGE = 10;

export default function StepDataReview({
    editInstrumentData,
    data,
    currentPage,
    totalPages,
    onNextPage,
    onPrevPage,
    onBack,
    onConfirm
}: Readonly<{
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
        editInstrumentData(newData);
        setIsOpen(false);


    }


    const handleSetInstrumentoEditando = (instrumento: InstrumentoDTO) => {
        setInstrumentoEditando(instrumento);
        setIsOpen(true);
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


            <h2 className="text-2xl font-semibold text-gray-800">Datos procesados</h2>
            <ul className="space-y-2">
                {paginatedData.map((item, index) => (
                    <li key={index} className="flex flex-col bg-gray-100 p-3 rounded-lg">
                        <div className="flex flex-row items-center gap-2">
                            <FileIcon className="h-5 w-5 text-blue-500" />
                            <span className="text-sm text-gray-800 font-medium">{item.caratula}</span>
                        </div>
                        <span className="text-sm text-gray-600">Organismo: {item.juzgadoIdentifier}</span>
                        <span className="text-sm text-gray-600">Tramite: {item.instrumentoTypeIdentifier}</span>
                        <span className="text-sm text-gray-600">Fecha: {item.fecha_de_ingreso.toLocaleDateString()}</span>
                        <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => handleSetInstrumentoEditando(item)}>
                            Modificar información
                        </Button>
                    </li>
                ))}
            </ul>
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