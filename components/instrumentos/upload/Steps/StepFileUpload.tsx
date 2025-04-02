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
        <div className="flex flex-col gap-6 p-6  shadow-md rounded-lg border border-gray-300 w-full h-full  ">
            <h2 className="text-xl font-semibold text-gray-900 text-center">Carga de PDF</h2>
            <p className="text-gray-600 text-center">Sube un archivo PDF para procesar sus instrumentos.</p>
            <div 
                className={`border-2 border-dashed rounded-lg p-10 text-center transition-all flex flex-col items-center justify-center h-60 ${dragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <UploadIcon className="h-12 w-12 text-gray-400" />
                <p className="mt-3 text-sm text-gray-600 font-medium">Arrastra y suelta tu archivo PDF aquí</p>
                <span className="text-gray-500 text-sm">o</span>
                <Label
                    htmlFor="file-upload"
                    className="mt-3 px-5 py-2.5 border border-blue-500 text-blue-500 font-medium rounded-lg cursor-pointer hover:bg-blue-500 hover:text-white transition"
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
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-100 shadow-sm">
                    <FileTextIcon className="h-6 w-6 text-gray-500" />
                    <p className="text-sm text-gray-600 truncate max-w-xs">{file.name}</p>
                </div>
            )}
            <Button
                className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 rounded-lg transition disabled:bg-gray-300"
                disabled={!file || loading}
                onClick={handleOnNext}
            >
                {loading ? (
                    <ClipLoader loading size={20} speedMultiplier={1} color="#ffffff" />
                ) : (
                    <>
                        Siguiente paso
                        <ChevronRightIcon className="ml-2 h-4 w-4" />
                    </>
                )}
            </Button>
        </div>
    );
}
