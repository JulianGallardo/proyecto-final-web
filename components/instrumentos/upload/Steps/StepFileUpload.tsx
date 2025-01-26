import { Button } from "@/components/ui/button";
import { UploadIcon, ChevronRightIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { Label } from "@/components/ui/label";

export default function StepFileUpload({ file, onFileChange, onNext }: Readonly<{
    file: File | null;
    onFileChange: (file: File | null) => void;
    onNext: () => Promise<void>;
}>) {


    const [loading, setLoading] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        const selectedFile = event.target.files?.[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            onFileChange(selectedFile);
        } else {
            onFileChange(null);
            alert("Por favor, selecciona un archivo PDF válido.");
        }
    };

    const handleOnNext = async () => {
        setLoading(true);
        onNext().finally(() => setLoading(false));
    }

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">Carga de PDF</h2>
            <p className="text-gray-600">Sube un archivo PDF para procesar sus instrumentos.</p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                    Arrastra y suelta tu archivo PDF aquí, o
                </p>
                <Label
                    htmlFor="file-upload"
                    className="mt-2 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
                >
                    Seleccionar archivo
                    <Input
                        id="file-upload"
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={loading}
                    />
                </Label>
            </div>
            {file && <p className="mt-2 text-sm text-gray-600">Archivo seleccionado: <strong>{file.name}</strong></p>}
            <Button
                className="w-full mt-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-300"
                disabled={!file || loading}
                onClick={handleOnNext}
            >
                {
                    loading ?

                        <ClipLoader
                            loading
                            size={20}
                            speedMultiplier={1}
                            color="#ffffff"
                        />
                        :
                        <>
                            Siguiente paso
                            <ChevronRightIcon className="h-4 w-4" />
                        </>
                }

            </Button>
        </div>
    );
}
