import { Flag, Home } from "@mynaui/icons-react";
import AddressAutocomplete from "../addresAutoComplete";

interface AddressInputsProps {
    startPoint: string;
    endPoint: string;
    onStartPointChange: (value: string) => void;
    onEndPointChange: (value: string) => void;
}

export function AddressInputs({
    onStartPointChange,
    onEndPointChange
}: Readonly<AddressInputsProps>) {
    return (
        <div className="mb-4 flex flex-col gap-2">
            <AddressAutocomplete placeHolder="Ingrese el punto de inicio (opcional)"

                Icon={Home}
                onChange={onStartPointChange}
            />
            <AddressAutocomplete placeHolder="Ingrese el punto final (opcional)"

                Icon={Flag}
                onChange={onEndPointChange}
            />
        </div>
    );
}
