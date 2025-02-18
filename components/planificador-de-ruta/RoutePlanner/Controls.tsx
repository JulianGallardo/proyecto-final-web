import { Button } from "@/components/ui/button";
import { FatCornerUpLeft } from "@mynaui/icons-react";
import { RouteMetrics } from "./RouteMetrics";
import { RouteControls } from "./RouteControl";
import { AddressInputs } from "./AddressInputs";
import { InstrumentList } from "./InstrumentList";
import { useRoutePlanner } from "@/hooks/use-route";
import { InstrumentoExtendido } from "@/types/instrumentoTypes";
import { useIsMobile } from "@/hooks/use-mobile";
import { FlagTriangleRightIcon } from "lucide-react";
import { createEntregas } from "@/actions/entrega-instrumentos-actions";
import { AgenteExtendidoDto } from "@/types/agenteTypes";
import { toast } from "@/hooks/use-toast";

interface ControlsProps {
    volver: () => void;
    instrumentos: InstrumentoExtendido[];
    agente: AgenteExtendidoDto
}

export default function Controls({ volver, instrumentos, agente }: Readonly<ControlsProps>) {
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
        routeChoice,
        setRouteChoice
    } = useRoutePlanner(instrumentos);

    const isMobile = useIsMobile();

    async function handleFinalizarEntrega() {
        const instrumentosFilter = orderedAddresses.filter((addr) => addr.visited && addr.instrument !== undefined);

        const instrumentosDelivered = instrumentosFilter.map((addr) => addr.instrument!);

        console.log(instrumentosDelivered);
        setRouteSegments([]);
        setOrderedAddresses([]);
        setStartPoint("");
        setEndPoint("");

        try {


            const entregas = await createEntregas(instrumentosDelivered, agente);

            if (entregas.length === 0) {
                throw new Error("No se pudieron registrar las entregas");
            }
            else{
                
            toast({
                title: "Entregas registradas",
                description: `Las entregas han sido registradas correctamente`,
                className: "bg-green-500 text-white",
                duration: 3000,
            });
            }

        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: (error instanceof Error ? error.message : "Ha ocurrido un error al registrar las entregas"),
                className: "bg-red-500 text-white",
                duration: 3000,

            }
            );
        }



    }


    return (
        <div className="flex flex-col gap-2">

            <Button
                onClick={calculateRoute}
                className="w-full bg-green-500 hover:bg-green-600 mt-4"
                disabled={loading || selectedInstruments.length === 0}
            >
                {loading ? "Calculando..." : "🛣️ Calcular Ruta"}
            </Button>


            <RouteControls vehicle={vehicle} setVehicle={setVehicle} routeChoice={routeChoice} setRouteChoice={setRouteChoice} />

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
                disabled={!canFinish}
                onClick={
                    handleFinalizarEntrega
                }
                className="w-full bg-yellow-500 hover:bg-yellow-700 mt-4"
            >
                <span>Finalizar Entrega</span>
                <FlagTriangleRightIcon className="w-6 h-6" />
            </Button>

            <div className="flex items-center justify-between">
                <Button onClick={volver} className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full">
                    <span className="mr-2">Volver atras</span>
                    <FatCornerUpLeft className="w-6 h-6" />
                </Button>

            </div>
            {routeMetrics && !isMobile && <RouteMetrics metrics={routeMetrics} />}
        </div>
    );
}