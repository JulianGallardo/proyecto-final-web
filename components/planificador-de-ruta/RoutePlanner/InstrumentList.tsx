import { Button } from "@/components/ui/button";
import { InstrumentoExtendido } from "@/types/instrumentoTypes";
import { Address } from "@/types/PlannerTypes";

interface InstrumentListProps {
    instruments: InstrumentoExtendido[];
    orderedAddresses: Address[];
    markAsVisited: (stopNumber: number) => void;
    cancelVisit: (stopNumber: number) => void;
}

export function InstrumentList({ instruments, orderedAddresses, markAsVisited,cancelVisit }: Readonly<InstrumentListProps>) {



    const calculateText = (address: Address) => {
        if (address.type === "start") return "Inicio";
        if (address.type === "end") return "Fin";
        if (address.type === "waypoint") return `Parada ${address.stopNumber} - `;
        return "";
    };

    return (
        <div className="space-y-2">
            {orderedAddresses.length === 0 && instruments.map((instrument) => (
                <div key={instrument.codigoInstrumento} className="flex items-start gap-2 p-2 bg-white rounded-lg shadow">
                    <div className="flex-none w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold">
                        -
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                            {instrument.instrumentoType.name} - {instrument.codigoInstrumento}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                            {instrument.domicilio_denunciado}
                        </p>
                    </div>
                </div>
            ))}
            {orderedAddresses.map((address) => (
                <div key={address.stopNumber} className="flex items-start gap-2 p-2 bg-white rounded-lg shadow">
                    <div className="flex-none w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold">
                        {address.stopNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                            {calculateText(address)}
                            {address.instrument ? `${address.instrument.instrumentoType.name} - ${address.instrument.codigoInstrumento}` : ""}
                        </p>
                        <div className="flex flex-col md:flex-row gap-2  justify-between">
                            <p className="text-sm text-gray-500 truncate">
                                {address.text}
                            </p>
                            <div className="flex gap-2 items-start justify-start ">
                                {
                                    address.type === "waypoint" &&
                                    <Button
                                        disabled={address.visited}
                                        className="bg-blue-500 hover:bg-blue-700" onClick={() => markAsVisited(address.stopNumber)}>
                                        Marcar visitada
                                    </Button>
                                }
                                {
                                    address.type === "waypoint" &&
                                    <Button
                                        disabled={address.visited}
                                        className="bg-red-500 hover:bg-red-700" onClick={() => cancelVisit(address.stopNumber)}>
                                        Anular
                                    </Button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}