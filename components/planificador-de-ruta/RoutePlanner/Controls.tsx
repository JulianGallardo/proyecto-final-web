import { Button } from "@/components/ui/button";
import { FatCornerUpLeft } from "@mynaui/icons-react";
import { RouteMetrics } from "./RouteMetrics";
import { RouteControls } from "./RouteControl";
import { AddressInputs } from "./AddressInputs";
import { InstrumentList } from "./InstrumentList";
import { useRoutePlanner } from "@/hooks/use-route";
import { InstrumentoExtendido } from "@/types/instrumentoTypes";

interface ControlsProps {
    volver: () => void;
    instrumentos: InstrumentoExtendido[];
}

export default function Controls({ volver, instrumentos }: Readonly<ControlsProps>) {
    const {
        orderedAddresses,
        setOrderedAddresses,
        setRouteSegments,
        vehicle,
        setVehicle,
        startPoint,
        setStartPoint,
        endPoint,
        setEndPoint,
        loading,
        calculateRoute,
        markAsVisited,
        canFinish,
        selectedInstruments,
        routeMetrics,
    } = useRoutePlanner(instrumentos);


    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <Button onClick={volver} className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full">
                    <span className="mr-2">Volver atras</span>
                    <FatCornerUpLeft className="w-6 h-6" />
                </Button>

            </div>

            <RouteControls vehicle={vehicle} setVehicle={setVehicle} />

            <AddressInputs
                startPoint={startPoint}
                endPoint={endPoint}
                onStartPointChange={setStartPoint}
                onEndPointChange={setEndPoint}
            />

            <h2 className="text-lg font-semibold mb-2">Instrumentos en ruta:</h2>
            <InstrumentList
                instruments={selectedInstruments}
                orderedAddresses={orderedAddresses}
                markAsVisited={markAsVisited}
            />

            <Button
                onClick={calculateRoute}
                className="w-full bg-green-500 hover:bg-green-600 mt-4"
                disabled={loading || selectedInstruments.length === 0}
            >
                {loading ? "Calculando..." : "🛣️ Calcular Ruta"}
            </Button>

            {canFinish && (
                <Button
                    onClick={() => {
                        setOrderedAddresses(orderedAddresses.map((addr) => (addr.type === "end" ? { ...addr, visited: true } : addr))
                        );
                        setRouteSegments([]);
                    }}
                    className="w-full bg-blue-500 hover:bg-blue-700 mt-4"
                >
                    <span>🏁 Finalizar Ruta</span>
                </Button>
            )}

            {routeMetrics && <RouteMetrics metrics={routeMetrics} />}
        </div>
    );
}