import { InstrumentoExtendido } from "@/types/instrumentoTypes";
import { ScrollArea } from "../../../ui/scroll-area";
import { Button } from "../../../ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../ui/card";
import InstrumentReviewItem from "./reviewItems";


interface ReviewStepProps {
    selectedInstruments: InstrumentoExtendido[];
    handleToggleInstrument: (instrument: InstrumentoExtendido) => void;
    handleDistribute: () => void;
    setStep: (value: "select" | "review") => void;
}

export default function ReviewStep({ selectedInstruments, handleToggleInstrument, handleDistribute, setStep }: Readonly<ReviewStepProps>) {
    return (
        <Card className="shadow-lg">
            <CardHeader className="space-y-2">
                <CardTitle className="text-2xl font-bold">Revisar Selección</CardTitle>
                <CardDescription className="text-base">
                    {selectedInstruments.length} instrumentos seleccionados para distribución
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <ScrollArea className="h-max-screen border rounded-lg">
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
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
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
            </CardContent>
        </Card>
    );
}