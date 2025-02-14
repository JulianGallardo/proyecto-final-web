import { useState, useEffect } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { RouteService } from "@/lib/locationUtils/routeService";
import { VehicleType, Address } from "@/types/PlannerTypes";
import { InstrumentoExtendido } from "@/types/instrumentoTypes";
import { FatCornerUpLeft } from "@mynaui/icons-react";
import { Bike, Car, Flag, Footprints, Home } from "lucide-react";
import { MapComponent } from "./mapRoute";
import AddressAutocomplete from "./addresAutoComplete";

interface RoutePlannerProps {
    instruments: InstrumentoExtendido[];
    volver: () => void;
}

export default function RoutePlanner({ instruments, volver }: Readonly<RoutePlannerProps>) {
    const [orderedAddresses, setOrderedAddresses] = useState<Address[]>([]);
    const [vehicle, setVehicle] = useState<VehicleType>("driving-car");
    const [loading, setLoading] = useState(false);
    const [startPoint, setStartPoint] = useState<string>("");
    const [endPoint, setEndPoint] = useState<string>("");
    const [routeMetrics, setRouteMetrics] = useState<{ distance: number; duration: number } | null>(null);
    const [selectedInstruments, setSelectedInstruments] = useState<InstrumentoExtendido[]>([]);
    const [routeSegments, setRouteSegments] = useState<any[]>([]);

    const routeService = new RouteService();



    useEffect(() => {
        setSelectedInstruments(instruments);
    }, [instruments]);

    useEffect(() => {
        console.log("start point", startPoint);
        console.log("end point", endPoint);
    }
        , [startPoint, endPoint]);

    async function calculateRoute() {
        if (selectedInstruments.length === 0) {
            alert("No hay instrumentos para calcular la ruta.");
            return;
        }

        setLoading(true);

        try {
            const instrumentAddresses: Address[] = selectedInstruments.map(instrument => ({
                type: "waypoint",
                text: instrument.domicilio_denunciado,
                coordinates: instrument.latitude && instrument.longitude
                    ? [instrument.longitude, instrument.latitude] as [number, number]
                    : undefined,
                instrument: instrument,
                stopNumber: 0,
                visited: false
            }));

            let allAddresses = instrumentAddresses;


            const locationsWithCoords = await Promise.all(
                allAddresses.map(async (addr) => {
                    if ('coordinates' in addr && addr.coordinates) return addr;
                    const coords = await routeService.getCoordinates(addr.text);
                    return coords ? { ...addr, coordinates: coords } : null;
                })
            );

            const validLocations = locationsWithCoords.filter((loc): loc is Address & { coordinates: [number, number]; instrument?: InstrumentoExtendido } =>
                loc !== null && loc.coordinates !== undefined
            );

            if (validLocations.length < 2) {
                alert("No se encontraron coordenadas suficientes para calcular la ruta.");
                return;
            }

            const waypointsIndices = Array.from({ length: validLocations.length }, (_, i) => i);
            const optimizedWaypoints = await routeService.getOptimizedRoute(
                waypointsIndices.map(i => validLocations[i].coordinates),
                vehicle
            );

            const ordered = optimizedWaypoints.map(i => validLocations[i]);

            ordered.forEach((loc, i) => {
                loc.stopNumber = i + 1;
            });

            if (startPoint) {
                const coords = await routeService.getCoordinates(startPoint);
                if (coords) {
                    ordered.unshift({
                        type: "start",
                        text: startPoint,
                        coordinates: coords,
                        stopNumber: 0,
                        visited: false
                    });
                }
            }

            if (endPoint) {
                const coords = await routeService.getCoordinates(endPoint);
                if (coords) {
                    ordered.push({
                        type: "end",
                        text: endPoint,
                        coordinates: coords,
                        stopNumber: ordered.length,
                        visited: false
                    });
                }
            }



            setOrderedAddresses(ordered);

            const routeSegments = await routeService.getRouteGeometry(
                ordered,
                ordered.map(loc => loc.coordinates),
                vehicle
            );

            const totalMetrics = routeSegments.reduce(
                (acc, segment) => ({
                    distance: acc.distance + segment.distance,
                    duration: acc.duration + segment.duration
                }),
                { distance: 0, duration: 0 }
            );
            setRouteMetrics(totalMetrics);

            setRouteSegments(routeSegments);
        } catch (error) {
            console.error("Error calculating route:", error);
            alert("Error al calcular la ruta. Por favor, intente nuevamente.");
        } finally {
            setLoading(false);
        }
    }

    async function markAsVisited(stopNumber: number) {
        

        const hasStart = orderedAddresses.some((addr) => addr.type === "start");

        if(hasStart ){
            setOrderedAddresses((prev) =>
                prev.map((addr) => (addr.type === "start" ? { ...addr, visited: true } : addr))
            );
        }
        setOrderedAddresses((prev) =>
            prev.map((addr) => (addr.stopNumber === stopNumber ? { ...addr, visited: true } : addr))
        );

        await recalculateRoute(stopNumber);

        

    }

    async function recalculateRoute(stopNumber?: number) {


        const hasStart = orderedAddresses.some((addr) => addr.type === "start");

        let ordered = orderedAddresses.map((addr) =>
            addr.stopNumber === stopNumber ? { ...addr, visited: true } : addr
        );



        if(hasStart ){
            ordered = ordered.filter((addr) => addr.type !== "start");
        }


        const routeSegments = await routeService.getRouteGeometry(
            ordered,
            ordered.map(loc => loc.coordinates).filter((coords): coords is [number, number] => coords !== undefined),
            vehicle,
            stopNumber
        );

        const totalMetrics = routeSegments.reduce(
            (acc, segment) => ({
                distance: acc.distance + segment.distance,
                duration: acc.duration + segment.duration
            }),
            { distance: 0, duration: 0 }
        );
        setRouteMetrics(totalMetrics);
        setRouteSegments(routeSegments);

    }


    return (
        <div className="flex flex-col gap-2 md:gap-0 md:flex-row h-screen w-full">
            <div className="w-full h-full md:w-1/3 p-6 bg-gray-100 shadow-lg overflow-y-auto">
                <Button onClick={volver} className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <span className="mr-2">Volver atras</span>
                    <FatCornerUpLeft className="w-6 h-6" />
                </Button>
                <h1 className="text-2xl font-bold mb-4">Planificador de Ruta</h1>

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

                {routeMetrics && <RouteMetrics metrics={routeMetrics} />}
            </div>

            <div className="container w-full h-full md:w-2/3">
                <MapComponent
                    orderedAddresses={orderedAddresses}
                    routeSegments={routeSegments}
                    selectedInstruments={selectedInstruments}
                />
            </div>
        </div>
    );
}
interface RouteControlsProps {
    vehicle: VehicleType;
    setVehicle: (vehicle: VehicleType) => void;
}

const vehicles = [
    { id: "driving-car", label: "Auto", icon: Car },
    { id: "cycling-regular", label: "Bicicleta", icon: Bike },
    { id: "foot-walking", label: "Caminata", icon: Footprints },
];

export function RouteControls({ vehicle, setVehicle }: Readonly<RouteControlsProps>) {
    return (
        <div className="flex gap-2 mb-4">
            {vehicles.map(({ id, label, icon: Icon }) => (
                <Button
                    key={id}
                    variant={vehicle === id ? "default" : "outline"}
                    onClick={() => setVehicle(id as VehicleType)}
                    className={"flex items-center gap-2 px-4 py-2 hover:bg-blue-200 " +
                        (vehicle === id ? "bg-blue-600 text-white" : "text-black-500")}
                >
                    <Icon className="w-5 h-5" />
                    {label}
                </Button>
            ))}
        </div>
    );
}


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


interface InstrumentListProps {
    instruments: InstrumentoExtendido[];
    orderedAddresses: Address[];
    markAsVisited: (stopNumber: number) => void;
}

export function InstrumentList({ instruments, orderedAddresses, markAsVisited }: Readonly<InstrumentListProps>) {




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
                            {address.type === "start" ? "Inicio " : address.type === "end" ? "Fin " : ""}
                            {address.instrument ? `${address.instrument.instrumentoType.name} - ${address.instrument.codigoInstrumento}` : ""}
                        </p>
                        <div className="flex flex-row gap-2 items-center justify-between">
                            <p className="text-sm text-gray-500 truncate">
                                {address.text}
                            </p>
                            {
                                address.type === "waypoint" &&
                                <Button
                                    disabled={address.visited}
                                    className="bg-blue-500 hover:bg-blue-700" onClick={() => markAsVisited(address.stopNumber)}>
                                    Marcar visitada
                                </Button>   
                            }
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}




interface RouteMetricsProps {
    metrics: { distance: number; duration: number };
}

export function RouteMetrics({ metrics }: Readonly<RouteMetricsProps>) {
    return (
        <Card className="mt-4">
            <CardContent className="pt-4">
                <h3 className="font-semibold mb-2">Información de la ruta:</h3>
                <p>🛣️ Distancia total: {(metrics.distance / 1000).toFixed(2)} km</p>
                <p>⏱️ Tiempo estimado: {Math.round(metrics.duration / 60)} minutos</p>
            </CardContent>
        </Card>
    );
}
