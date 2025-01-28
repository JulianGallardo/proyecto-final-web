import { getInstrumentTypes, getJuzgados } from "@/actions/instrumentos-actions";
import { Button } from "@/components/ui/button";
import { useCustomDialog } from "@/hooks/useCustomDialog";
import { InstrumentoDTO, InstrumentPDFDTO } from "@/types/instrumentoTypes";
import { InstrumentoType, Juzgado } from "@prisma/client";
import { FileIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { FormularioInstrumento } from "../../Forms/formulario-instrumento";
import CustomDialog from "../../Dialogs/dialog";
import { Accordion } from "@/components/ui/accordion";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion";
import { ArrowDown } from "@mynaui/icons-react";
import { parseDate } from "@/lib/utils";


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
            <div className="flex flex-col gap-4 w-full">

                {paginatedData.map((item, index) => (
                    <InstrumentoDataView key={index} instrumento={item} handleSetInstrumentoEditando={handleSetInstrumentoEditando} />
                ))}
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

function InstrumentoDataView({ instrumento, handleSetInstrumentoEditando }: Readonly<{ instrumento: InstrumentoDTO, handleSetInstrumentoEditando: (instrumento: InstrumentoDTO) => void }>) {
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
                            <span className="text-sm text-gray-700"><strong>Fecha de salida:</strong> {instrumento.fecha_de_salida ? parseDate(instrumento.fecha_de_salida.toISOString()): "Sin fecha"}</span>
                            <span className="text-sm text-gray-700"><strong>Domicilio Denunciado:</strong> {instrumento.domicilio_denunciado}</span>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-all" onClick={() => handleSetInstrumentoEditando(instrumento)}>
                                Modificar información
                            </Button>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}


