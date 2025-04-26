"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { extractTextFromPDFAndParse } from "@/lib/readPdf";
import { createInstrumentos, deleteDuplicatePdfEntries } from "@/actions/instrumentos-actions";
import { InstrumentoDTO, InstrumentoDtoWithError, InstrumentPDFDTO } from "@/types/instrumentoTypes";
import { toast } from "@/hooks/use-toast";
import StepDataReview from "@/components/instrumentos/upload/Steps/StepDataReview";
import StepFileUpload from "@/components/instrumentos/upload/Steps/StepFileUpload";
import ConfirmStep from "@/components/instrumentos/upload/Steps/ConfirmStep";
import SaveInstrument from "@/components/instrumentos/upload/Steps/SaveInstruments";


export default function PDFUploadProcess() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<(InstrumentoDTO | InstrumentoDtoWithError)[]>([]);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Track errors explicitly

  const handleFileUpload = async () => {
    if (!file) return;

    try {
      const parsedData = await extractTextFromPDFAndParse(file) as InstrumentPDFDTO[];
      if (!parsedData || parsedData.length === 0) throw new Error("No se encontraron instrumentos en el PDF");

      const result = await deleteDuplicatePdfEntries(parsedData);

      if (!result || typeof result !== "object") throw new Error("Error al procesar el PDF");

      const  filteredInstrument  = result 

      if (filteredInstrument.length === 0 ) {
        throw new Error("Los instrumentos en el PDF ya están cargados.");
      }

      setData(filteredInstrument);
      setStep(2);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Ha ocurrido un error al procesar el PDF";
      console.error(error);
      setErrorMessage(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        className: "bg-red-500 text-white",
        duration: 3000,
      });
      setStep(1); // Reset to file upload step on error
    }
  };

  const confirmUpload = async () => {
    try {
      setStep(3);
      startTransition(async () => {
        try {
          const result = await createInstrumentos(data); // Ensure the action returns a result
          if (!result || result.length === 0) {
            throw new Error("No se crearon instrumentos correctamente");
          }
        } catch (serverError) {
          const errorMsg = serverError instanceof Error ? serverError.message : "Error desconocido al crear instrumentos";
          throw new Error(errorMsg);
        }
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Ha ocurrido un error al crear el instrumento";
      console.error(error);
      setErrorMessage(errorMsg.includes("juzgado") ? errorMsg : `Error creando instrumentos: ${errorMsg}`);
      toast({
        title: "Error",
        description: errorMsg,
        className: "bg-red-500 text-white",
        duration: 3000,
      });
      setStep(4); // Move to error step on failure
    }
  };

  

  const editInstrumentData = (instrument: InstrumentoDTO) => {
    try {
      const index = data.findIndex((i) => i.codigo === instrument.codigo);
      if (index !== -1) {
        const newData = [...data];
        newData.splice(index, 1, instrument);
        setData(newData);
      }
    } catch (error) {
      console.error("Error editing instrument data:", error);
      setErrorMessage("Error al editar los datos del instrumento");
      toast({
        title: "Error",
        description: "Error al editar los datos del instrumento",
        className: "bg-red-500 text-white",
        duration: 3000,
      });
    }
  };

  const deleteInstrumentData = (instrument: InstrumentoDTO) => {
    try {
      const index = data.findIndex((i) => i.codigo === instrument.codigo);
      if (index !== -1) {
        const newData = [...data];
        newData.splice(index, 1);
        setData(newData);
      }
    } catch (error) {
      console.error("Error deleting instrument data:", error);
      setErrorMessage("Error al eliminar el instrumento");
      toast({
        title: "Error",
        description: "Error al eliminar el instrumento",
        className: "bg-red-500 text-white",
        duration: 3000,
      });
    }
  };


  


  return (
    <div className="flex flex-col items-center w-full h-full p-4 gap-2  ">
      <div className="flex flex-col gap-4 w-full   ">

        <div className="flex flex-row items-center justify-end w-full">
          <Link href="/instrumentos" className="flex flex-row items-center gap-2 w-fit">
            <Button variant="outline" className="flex flex-row w-fit gap-2">
              <ChevronLeftIcon className="h-4 w-4" />
              Volver al listado
            </Button>
          </Link>
        </div>


        <div className="w-full h-full flex flex-col gap-4 rounded-lg px-4 pb-6  ">

          {step === 1 && (
              <StepFileUpload
                file={file}
                onFileChange={setFile}
                onNext={handleFileUpload}

              />
          )}


          {step === 2 && (
            <StepDataReview
              data={data}
              editInstrumentData={editInstrumentData}
              deleteInstrumentData={deleteInstrumentData}
              onBack={() => setStep(1)}
              onConfirm={confirmUpload}
            />
          )}

          {step === 3 && (
            isPending ? (
              <SaveInstrument />
            ) : (
              <ConfirmStep
                onClick={() => {
                  setFile(null);
                  setData([]);
                  setStep(1);
                  setErrorMessage(null); // Reset error state
                }}
              />
            )
          )}

          {step === 4 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold">Error al cargar los instrumentos</h2>
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              <Button
                onClick={() => {
                  setFile(null);
                  setData([]);
                  setStep(1);
                  setErrorMessage(null); // Reset error state
                }}
              >
                Volver
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}