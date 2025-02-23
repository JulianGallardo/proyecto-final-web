import { InstrumentoExtendido } from "@/types/instrumentoTypes";
import { ScrollArea } from "../../../ui/scroll-area";
import { Button } from "../../../ui/button";
import InstrumentReviewItem from "./reviewItems";

interface ReviewStepProps {
    selectedInstruments: InstrumentoExtendido[];
    handleToggleInstrument: (instrument: InstrumentoExtendido) => void;
    handleDistribute: () => void;
    setStep: (value: "select" | "review") => void;
}

export default function ReviewStep({ 
    selectedInstruments, 
    handleToggleInstrument, 
    handleDistribute, 
    setStep 
}: Readonly<ReviewStepProps>) {
    return (
        <div className="bg-white w-full h-full">
            {/* Header Section */}
            <div className="p-6 space-y-2 border-b">
                <h2 className="text-2xl font-bold">
                    Revisar Selección
                </h2>
                <p className="text-base text-gray-500">
                    {selectedInstruments.length} instrumentos seleccionados para distribución
                </p>
            </div>

            {/* Content Section */}
            <div className="p-6 space-y-4 w-full">
                <ScrollArea className="h-max-screen border rounded-lg w-full">
                    <div className="p-4 space-y-2">
                        {selectedInstruments.map((instrument) => (
                            <InstrumentReviewItem
                                key={instrument.codigoInstrumento}
                                instrument={instrument}
                                handleToggleInstrument={handleToggleInstrument}
                            />
                        ))}
                    </div>
                </ScrollArea>

                {/* Footer Section */}
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4 border-t">
                    <Button
                        variant="outline"
                        onClick={() => setStep("select")}
                        className="w-full sm:w-auto"
                    >
                        Volver a Selección
                    </Button>
                    <Button
                        onClick={handleDistribute}
                        className="w-full sm:w-auto"
                    >
                        Distribuir Instrumentos
                    </Button>
                </div>
            </div>
        </div>
    );
}