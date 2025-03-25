import { Button } from "@/components/ui/button";
import { FatCornerUpLeft } from "@mynaui/icons-react";
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
import PreviewContent from "./PreviewContent";
import Instrucciones from "./Instrucciones";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipLoader } from "react-spinners";

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
        setRouteChoice,
        routeSegments,
        setRouteMetrics,
        cancelVisit
    } = useRoutePlanner(instrumentos);

    const isMobile = useIsMobile();

    async function handleFinalizarEntrega() {
        const instrumentosFilter = orderedAddresses.filter(addr => addr.visited && addr.instrument);
        const instrumentosDelivered = instrumentosFilter.map(addr => addr.instrument).filter((instrument): instrument is InstrumentoExtendido => instrument !== undefined);

        setRouteSegments([]);
        setRouteMetrics(null);
        setOrderedAddresses([]);
        setStartPoint("");
        setEndPoint("");

        try {
            const entregas = await createEntregas(instrumentosDelivered, agente);

            if (entregas.length === 0) {
                throw new Error("No se pudieron registrar las entregas");
            }

            toast({
                title: "Entregas registradas",
                description: "Las entregas han sido registradas correctamente",
                className: "bg-green-500 text-white",
                duration: 3000,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Ha ocurrido un error al registrar las entregas",
                className: "bg-red-500 text-white",
                duration: 3000,
            });
        }
    }

    return (
        <Tabs defaultValue="controls">
            <TabsList className="w-full flex">
                <TabsTrigger value="controls" className="w-1/2">Controles</TabsTrigger>
                <TabsTrigger value="instructions" className="w-1/2">Instrucciones</TabsTrigger>
            </TabsList>

            <TabsContent value="controls">
                <div className="flex flex-col gap-2">
                    {!isMobile && (
                        <PreviewContent routeMetrics={routeMetrics} />
                    )}

                    <Button
                        onClick={calculateRoute}
                        className="w-full bg-green-500 hover:bg-green-600 mt-4"
                        disabled={loading || selectedInstruments.length === 0 || !startPoint }
                    >
                        {loading ? <ClipLoader
                            loading
                            size={15}
                            speedMultiplier={1}
                            color="#ffffff"
                        /> : "Calcular recorrido"}
                    </Button>

                    <RouteControls vehicle={vehicle} setVehicle={setVehicle} routeChoice={routeChoice} setRouteChoice={setRouteChoice} />
                    <AddressInputs startPoint={startPoint} endPoint={endPoint} onStartPointChange={setStartPoint} onEndPointChange={setEndPoint} />

                    <h2 className="text-lg font-semibold mb-2">Instrumentos en ruta:</h2>
                    <InstrumentList instruments={selectedInstruments} orderedAddresses={orderedAddresses} markAsVisited={markAsVisited} cancelVisit={cancelVisit} />

                    <Button
                        disabled={!canFinish}
                        onClick={handleFinalizarEntrega}
                        className="w-full bg-yellow-500 hover:bg-yellow-700 mt-4"
                    >
                        <span>Finalizar Diligenciamiento</span>
                        <FlagTriangleRightIcon className="w-6 h-6" />
                    </Button>

                    <div className="flex items-center justify-between">
                        <Button onClick={volver} className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full">
                            <span className="mr-2">Volver atras</span>
                            <FatCornerUpLeft className="w-6 h-6" />
                        </Button>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="instructions">
                <Instrucciones instrucciones={
                    routeSegments.map(segment => ({ segmento: segment.description, instrucciones: segment.instructions }))
                } />
            </TabsContent>
        </Tabs>
    );
}
