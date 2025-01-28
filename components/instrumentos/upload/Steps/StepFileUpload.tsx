import { Button } from "@/components/ui/button";
import { UploadIcon, ChevronRightIcon, FileTextIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { Label } from "@/components/ui/label";

export default function StepFileUpload( {file,onFileChange,onNext}:Readonly<{
    file: File | null;
    onFileChange: (file: File | null) => void;
    onNext: () => Promise<void>;
}> ){
    const [loading, setLoading] = useState(false);
    const [dragging, setDragging] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null;
        processFile(selectedFile);
    };

    const processFile = (selectedFile: File | null) => {
        if (selectedFile && selectedFile.type === "application/pdf") {
            onFileChange(selectedFile);
        } else {
            onFileChange(null);
            alert("Por favor, selecciona un archivo PDF válido.");
        }
    };

    const handleDragOver = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragging(false);
        const droppedFile = event.dataTransfer.files?.[0];
        processFile(droppedFile);
    };

    const handleOnNext = async () => {
        setLoading(true);
        await onNext();
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">Carga de PDF</h2>
            <p className="text-gray-600">Sube un archivo PDF para procesar sus instrumentos.</p>
            <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${dragging ? "border-blue-500 bg-blue-100" : "border-gray-300"}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
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
            {file && (
                <div className="flex items-center gap-2 mt-2 p-2 border rounded-lg bg-gray-100">
                    <FileTextIcon className="h-6 w-6 text-gray-500" />
                    <p className="text-sm text-gray-600 truncate max-w-xs">{file.name}</p>
                </div>
            )}
            <Button
                className="w-full mt-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-300"
                disabled={!file || loading}
                onClick={handleOnNext}
            >
                {loading ? (
                    <ClipLoader loading size={20} speedMultiplier={1} color="#ffffff" />
                ) : (
                    <>
                        Siguiente paso
                        <ChevronRightIcon className="h-4 w-4" />
                    </>
                )}
            </Button>
        </div>
    );
}
