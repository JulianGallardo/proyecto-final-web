import { useState, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { MapService } from "@/lib/locationUtils/mapService";
import { RouteService } from "@/lib/locationUtils/routeService";
import { VehicleType, Address } from "@/types/PlannerTypes";
import { InstrumentoExtendido } from "@/types/instrumentoTypes";
import { getCoordinates } from "@/lib/locationUtils/zoneUtils";
import { FatCornerUpLeft } from "@mynaui/icons-react";
import { Bike, Car, Flag, Footprints, Home } from "lucide-react";

interface RoutePlannerProps {
    instruments: InstrumentoExtendido[];
    volver: () => void;
}

export default function RoutePlanner({ instruments, volver }: Readonly<RoutePlannerProps>) {
    const mapContainer = useRef(null);
    const map = useRef<maplibregl.Map | null>(null);
    const [orderedAddresses, setOrderedAddresses] = useState<Address[]>([]);
    const [vehicle, setVehicle] = useState<VehicleType>("driving-car");
    const [loading, setLoading] = useState(false);
    const [startPoint, setStartPoint] = useState<string>("");
    const [endPoint, setEndPoint] = useState<string>("");
    const [routeMetrics, setRouteMetrics] = useState<{ distance: number; duration: number } | null>(null);
    const [selectedInstruments, setSelectedInstruments] = useState<InstrumentoExtendido[]>([]);
    const markersRef = useRef<maplibregl.Marker[]>([]);
    const routeLayers = useRef<string[]>([]);

    const mapService = new MapService();
    const routeService = new RouteService();

    useEffect(() => {
        if (!map.current && mapContainer.current) {
            map.current = new maplibregl.Map({
                container: mapContainer.current,
                style: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
                center: [-62.267, -38.7196],
                zoom: 12,
            });

            map.current.addControl(new maplibregl.NavigationControl(), "top-right");
        }
    }, []);

    useEffect(() => {
        setSelectedInstruments(instruments);
    }, [instruments]);

    async function calculateRoute() {
        if (selectedInstruments.length === 0) {
            alert("No hay instrumentos para calcular la ruta.");
            return;
        }

        setLoading(true);

        try {
            const instrumentAddresses: Address[] = selectedInstruments.map(instrument => ({
                text: instrument.domicilio_denunciado,
                coordinates: instrument.latitude && instrument.longitude
                    ? [instrument.longitude, instrument.latitude] as [number, number]
                    : undefined,
                instrument: instrument
            }));

            let allAddresses = instrumentAddresses;
            if (startPoint) {
                const startCoordinates = await getCoordinates(startPoint);
                if (startCoordinates) allAddresses = [{ text: startPoint, coordinates: startCoordinates }, ...allAddresses];
            }
            if (endPoint) {
                const endCoordinates = await getCoordinates(endPoint);
                if (endCoordinates) allAddresses = [...allAddresses, { text: endPoint, coordinates: endCoordinates }];
            }

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
            setOrderedAddresses(ordered);

            const routeSegments = await routeService.getRouteGeometry(
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

            if (map.current) {
                mapService.cleanup(map.current, routeLayers.current, markersRef.current);
                markersRef.current = [];
                routeLayers.current = [];

                map.current.flyTo({
                    center: ordered[0].coordinates,
                    zoom: 13
                });

                ordered.forEach((addr, i) => {
                    const description = addr.instrument
                        ? `${addr.instrument.instrumentoType.name} - ${addr.instrument.codigoInstrumento}\n${addr.text}`
                        : addr.text;

                    const marker = mapService.addMarker(map.current!, {
                        coordinates: addr.coordinates!,
                        number: i + 1,
                        description
                    });
                    markersRef.current.push(marker);
                });

                routeSegments.forEach((segment, i) => {
                    const fromDesc = ordered[i].instrument
                        ? `${ordered[i].instrument.instrumentoType.name} - ${ordered[i].instrument.codigoInstrumento}`
                        : ordered[i].text;

                    const toDesc = ordered[i + 1].instrument
                        ? `${ordered[i + 1].instrument?.instrumentoType.name} - ${ordered[i + 1].instrument?.codigoInstrumento}`
                        : ordered[i + 1].text;

                    const { layerId, sourceId } = mapService.addRouteSegment(
                        map.current!,
                        {
                            ...segment,
                            description: `Tramo ${i + 1} → ${i + 2}: ${fromDesc} → ${toDesc}`
                        },
                        i
                    );
                    routeLayers.current.push(layerId, sourceId);
                });
            }
        } catch (error) {
            console.error("Error calculating route:", error);
            alert("Error al calcular la ruta. Por favor, intente nuevamente.");
        } finally {
            setLoading(false);
        }
    }

    const vehicles = [
        { id: "driving-car", label: "Auto", icon: Car },
        { id: "cycling-regular", label: "Bicicleta", icon: Bike },
        { id: "foot-walking", label: "Caminata", icon: Footprints },
      ];

    return (
        <div className="flex flex-col gap-2 md:gap-0 md:flex-row h-screen w-full">
            <div className="w-full h-full md:w-1/3 p-6 bg-gray-100 shadow-lg overflow-y-auto">
                <Button onClick={volver} className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <span className="mr-2">Volver atras</span>
                    <FatCornerUpLeft className="w-6 h-6" />
                </Button>
                <h1 className="text-2xl font-bold mb-4">Planificador de Ruta</h1>


                <div className="flex gap-2 mb-4">
                    {vehicles.map(({ id, label, icon: Icon }) => (
                        <Button
                            key={id}
                            variant={vehicle === id ? "default" : "outline"}
                            onClick={() => setVehicle(id as VehicleType)}
                            className={"flex items-center gap-2 px-4 py-2 hover:bg-blue-200 " + (vehicle === id ? "bg-blue-600 text-white" : "text-black-500")}
                        >
                            <Icon className="w-5 h-5" />
                            {label}
                        </Button>
                    ))}
                </div>


                <div className="mb-4 flex flex-col gap-2 ">
                    <div className="relative">
                        <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Ingrese el punto de inicio (opcional)"
                            value={startPoint}
                            onChange={(e) => setStartPoint(e.target.value)}
                            className="pl-10 h-10"
                        />
                    </div>
                    <div className="relative">
                        <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Ingrese el punto final (opcional)"
                            value={startPoint}
                            onChange={(e) => setEndPoint(e.target.value)}
                            className="pl-10 h-10"
                        />
                    </div>
                </div>

                <h2 className="text-lg font-semibold mb-2">Instrumentos en ruta:</h2>
                <div className="space-y-2">
                    {selectedInstruments.map((instrument) => (
                        <div key={instrument.codigoInstrumento} className="flex items-start gap-2 p-2 bg-white rounded-lg shadow">
                            <div className="flex-none w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold">
                                {orderedAddresses.length > 0
                                    ? orderedAddresses.findIndex(a => a.instrument?.codigoInstrumento === instrument.codigoInstrumento) + 1
                                    : "-"}
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
                </div>

                <Button
                    onClick={calculateRoute}
                    className="w-full bg-green-500 hover:bg-green-600 mt-4"
                    disabled={loading || selectedInstruments.length === 0}
                >
                    {loading ? "Calculando..." : "🛣️ Calcular Ruta"}
                </Button>

                {routeMetrics && (
                    <Card className="mt-4">
                        <CardContent className="pt-4">
                            <h3 className="font-semibold mb-2">Información de la ruta:</h3>
                            <p>🛣️ Distancia total: {(routeMetrics.distance / 1000).toFixed(2)} km</p>
                            <p>⏱️ Tiempo estimado: {Math.round(routeMetrics.duration / 60)} minutos</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="container w-full h-full md:w-2/3 ">
                <div ref={mapContainer} className="w-full h-full" />
            </div>
        </div>
    );
}