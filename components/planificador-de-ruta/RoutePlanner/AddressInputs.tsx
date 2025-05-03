import { Flag, Home } from "@mynaui/icons-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddressAutocomplete from "../addressAutoComplete";
import { useState } from "react";
import { Label } from "@/components/ui/label";

interface AddressInputsProps {
    startPoint: string;
    endPoint: string;
    onStartPointChange: (value: string) => void;
    onEndPointChange: (value: string) => void;
}

type EndPointOption = "none" | "same" | "custom";

export function AddressInputs({
    startPoint,
    onStartPointChange,
    onEndPointChange
}: Readonly<AddressInputsProps>) {
    const [endPointOption, setEndPointOption] = useState<EndPointOption>("none");

    const handleEndPointOptionChange = (value: EndPointOption) => {
        setEndPointOption(value);
        if (value === "none") {
            onEndPointChange("");
        } else if (value === "same") {
            onEndPointChange(startPoint);
        }
    };

    const handleStartPointChange = (value: string) => {
        onStartPointChange(value);
        if (endPointOption === "same") {
            onEndPointChange(value);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="space-y-2">
                <Label className="
                    flex items-center gap-2
                    text-sm font-semibold text-gray-500
                ">
                    <Home className="w-5 h-5" />
                    <span>Inicio</span>
                </Label>
                <AddressAutocomplete
                    placeHolder="Ingrese el punto de inicio"
                    onChange={handleStartPointChange}
                />
            </div>

            <div className="space-y-2">
                <Label className="
                    flex items-center gap-2
                    text-sm font-semibold text-gray-500
                ">
                    <Flag className="w-5 h-5" />
                    <span>Final</span>
                    
                </Label>
                <Select value={endPointOption} onValueChange={handleEndPointOptionChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione el tipo de punto final" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">Sin punto final</SelectItem>
                        <SelectItem value="same">Volver al inicio</SelectItem>
                        <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                </Select>

                {endPointOption === "custom" && (
                    <AddressAutocomplete
                        placeHolder="Ingrese el punto final"
                        onChange={onEndPointChange}
                    />
                )}
            </div>
        </div>
    );
}