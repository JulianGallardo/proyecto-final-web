import { InstrumentoExtendido } from "@/types/instrumentoTypes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "../../../ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import InputSearch from "../searchClient";
import InstrumentItem from "./instrumentItem";
import { SadCircle } from "@mynaui/icons-react";
interface SelectStepProps {
    instruments: InstrumentoExtendido[];
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    selectedInstruments: InstrumentoExtendido[];
    handleToggleInstrument: (instrument: InstrumentoExtendido) => void;
    setStep: (value: "select" | "review") => void;
}



export default function SelectStep({
    instruments,
    searchTerm,
    setSearchTerm,
    selectedInstruments,
    handleToggleInstrument,
    setStep
}: Readonly<SelectStepProps>) {




    return (
        <Card className="shadow-lg h-full ">
            <CardHeader className="space-y-2">
                <CardTitle className="text-2xl font-bold">Seleccionar Instrumentos</CardTitle>
                <CardDescription className="text-base">
                    Seleccione los instrumentos que desea distribuir
                    {selectedInstruments.length > 0 && (
                        <Badge variant="secondary" className="ml-2">
                            {selectedInstruments.length} seleccionados
                        </Badge>
                    )}
                    {
                        selectedInstruments.length === 0 && (
                            <Badge variant="secondary" className="ml-2">
                                No hay instrumentos seleccionados
                            </Badge>
                        )
                    }
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 ">
                <InputSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <ScrollArea className=" border rounded-lg">
                    <div className="p-4 space-y-2">
                        {instruments.map((instrument) => (
                            <InstrumentItem
                                key={instrument.codigoInstrumento}
                                instrument={instrument}
                                selectedInstruments={selectedInstruments}
                                handleToggleInstrument={handleToggleInstrument}
                            />
                        ))}
                        {
                            instruments.length === 0 && searchTerm.length > 0 && (
                                <div className="text-center text-gray-500">
                                    <SadCircle className="w-12 h-12 mx-auto" />
                                    <p>No hay resultados para la búsqueda</p>
                                </div>
                            )
                        }
                    </div>
                </ScrollArea>
                <div className="flex justify-end space-x-2 pt-4">
                    <Button
                        onClick={() => setStep("review")}
                        disabled={selectedInstruments.length === 0}
                        className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700"
                    >
                        Revisar Selección ({selectedInstruments.length})
                    </Button>
                </div>
            </CardContent>
        </Card>


    );
}