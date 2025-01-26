import { Button } from "@/components/ui/button";
import { InstrumentPDFDTO } from "@/types/instrumento";
import { FileIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";


const ITEMS_PER_PAGE = 10;

export default function StepDataReview({
    data,
    currentPage,
    totalPages,
    onNextPage,
    onPrevPage,
    onBack,
    onConfirm
}: Readonly<{
    data: InstrumentPDFDTO[];
    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPrevPage: () => void;
    onBack: () => void;
    onConfirm: () => void;
}>) {
    const paginatedData = data.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">Datos procesados</h2>
            <ul className="space-y-2">
                {paginatedData.map((item, index) => (
                    <li key={index} className="flex flex-col bg-gray-100 p-3 rounded-lg">
                        <div className="flex flex-row items-center gap-2">
                            <FileIcon className="h-5 w-5 text-blue-500" />
                            <span className="text-sm text-gray-800 font-medium">{item.caratula}</span>
                        </div>
                        <span className="text-sm text-gray-600">Organismo: {item.organismo}</span>
                        <span className="text-sm text-gray-600">Tramite: {item.tramite}</span>
                        <span className="text-sm text-gray-600">Fecha: {item.altaDisponibilidad}</span>
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