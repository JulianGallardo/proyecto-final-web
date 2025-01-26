import { Button } from "@/components/ui/button";
import { InstrumentPDFDTO } from "@/types/instrumento";
import { ChevronLeftIcon, ChevronRightIcon, FileIcon } from "lucide-react";

export default function StepErrorReview({
    data,
    errors,
    onBack,
    onNext
}: Readonly<{
    data: InstrumentPDFDTO[];
    errors: { juzgadoErrors: InstrumentPDFDTO[]; typeErrors: InstrumentPDFDTO[] };
    onBack: () => void;
    onNext: () => void;
}>) {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">Datos procesados</h2>

            {errors.juzgadoErrors.length > 0 && (
                <ErrorList
                    title="Errores de juzgado"
                    errors={errors.juzgadoErrors.map(e => ({ message: "No se encontró el juzgado", caratula: e.caratula }))}
                />
            )}

            {errors.typeErrors.length > 0 && (
                <ErrorList
                    title="Errores de tipo de instrumento"
                    errors={errors.typeErrors.map(e => ({ message: "No se encontró el tipo de instrumento", caratula: e.caratula }))}
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
function ErrorList({ title, errors }: Readonly<{ title: string; errors: { caratula: string; message: string }[] }>) {
    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-red-600">{title}</h3>
            <ul className="space-y-2">
                {errors.map((error, index) => (
                    <li key={index} className="flex flex-col bg-red-100 p-3 rounded-lg">
                        <div className="flex flex-row items-center gap-2">
                            <FileIcon className="h-5 w-5 text-red-500" />
                            <span className="text-sm text-gray-800 font-medium">{error.caratula}</span>
                        </div>
                        <span className="text-sm text-gray-600">Error: {error.message}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}