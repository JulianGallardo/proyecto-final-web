"use client";
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

export default function RoutePlanner() {
    const mapContainer = useRef(null);
    const map = useRef<maplibregl.Map | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [orderedAddresses, setOrderedAddresses] = useState<Address[]>([]);
    const [vehicle, setVehicle] = useState<VehicleType>("driving-car");
    const [loading, setLoading] = useState(false);
    const [startPoint, setStartPoint] = useState<string>("");
    const [endPoint, setEndPoint] = useState<string>("");
    const [routeMetrics, setRouteMetrics] = useState<{ distance: number; duration: number } | null>(null);
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

    const addAddress = () => setAddresses([...addresses, { text: "" }]);

    const updateAddress = (index: number, text: string) => {
        const newAddresses = [...addresses];
        newAddresses[index] = { text };
        setAddresses(newAddresses);
    };

    const removeAddress = (index: number) => {
        const newAddresses = addresses.filter((_, i) => i !== index);
        setAddresses(newAddresses);
        setOrderedAddresses([]);
    };

    async function calculateRoute() {
        if (!startPoint || !endPoint) {
            alert("Debes especificar un punto de inicio y fin.");
            return;
        }

        setLoading(true);

        try {
            // Combine start, waypoints, and end into a single array
            const allAddresses = [
                { text: startPoint },
                ...addresses,
                { text: endPoint }
            ];

            // Get coordinates for all addresses
            const locationsWithCoords = await Promise.all(
                allAddresses.map(async (addr) => {
                    const coords = await routeService.getCoordinates(addr.text);
                    return coords ? { ...addr, coordinates: coords } : null;
                })
            );

            const validLocations = locationsWithCoords.filter((loc): loc is Address & { coordinates: [number, number] } => 
                loc !== null && loc.coordinates !== undefined
            );

            if (validLocations.length < 2) {
                alert("No se encontraron coordenadas para algunas direcciones.");
                return;
            }

            // Get optimized route order, keeping start and end points fixed
            const waypointsIndices = Array.from({ length: validLocations.length - 2 }, (_, i) => i + 1);
            const optimizedWaypoints = await routeService.getOptimizedRoute(
                waypointsIndices.map(i => validLocations[i].coordinates),
                vehicle
            );

            // Reconstruct the full route with fixed start and end
            const ordered = [
                validLocations[0],
                ...optimizedWaypoints.map(i => validLocations[i + 1]),
                validLocations[validLocations.length - 1]
            ];
            setOrderedAddresses(ordered);

            const routeSegments = await routeService.getRouteGeometry(
                ordered.map(loc => loc.coordinates),
                vehicle
            );

            // Calculate total distance and duration
            const totalMetrics = routeSegments.reduce(
                (acc, segment) => ({
                    distance: acc.distance + segment.distance,
                    duration: acc.duration + segment.duration
                }),
                { distance: 0, duration: 0 }
            );
            setRouteMetrics(totalMetrics);

            if (map.current) {
                // Clean up previous route
                mapService.cleanup(map.current, routeLayers.current, markersRef.current);
                markersRef.current = [];
                routeLayers.current = [];

                // Center map on first location
                map.current.flyTo({ 
                    center: ordered[0].coordinates,
                    zoom: 13 
                });

                // Add markers
                ordered.forEach((addr, i) => {
                    const marker = mapService.addMarker(map.current!, {
                        coordinates: addr.coordinates!,
                        number: i + 1,
                        description: addr.text
                    });
                    markersRef.current.push(marker);
                });

                // Add route segments
                routeSegments.forEach((segment, i) => {
                    const { layerId, sourceId } = mapService.addRouteSegment(
                        map.current!,
                        {
                            ...segment,
                            description: `Tramo ${i + 1} → ${i + 2}: ${ordered[i].text} → ${ordered[i + 1].text}`
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

    return (
        <div className="flex h-screen w-full">
            <div className="w-1/3 p-6 bg-gray-100 shadow-lg overflow-y-auto">
                <h1 className="text-2xl font-bold mb-4">Planificador de Ruta</h1>

                <Select onValueChange={(v) => setVehicle(v as VehicleType)} defaultValue={vehicle}>
                    <SelectTrigger className="w-full mb-4">
                        <SelectValue placeholder="Selecciona un vehículo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="driving-car">🚗 Auto</SelectItem>
                        <SelectItem value="cycling-regular">🚲 Bicicleta</SelectItem>
                        <SelectItem value="foot-walking">🚶 Caminata</SelectItem>
                    </SelectContent>
                </Select>

                <div className="mb-4">
                    <Input
                        type="text"
                        value={startPoint}
                        onChange={(e) => setStartPoint(e.target.value)}
                        placeholder="Punto de inicio"
                        className="mb-2"
                    />
                    <Input
                        type="text"
                        value={endPoint}
                        onChange={(e) => setEndPoint(e.target.value)}
                        placeholder="Punto final"
                        className="mb-4"
                    />
                </div>

                <h2 className="text-lg font-semibold mb-2">Puntos intermedios:</h2>
                {addresses.map((address, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                        <div className="flex-none w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold">
                            {orderedAddresses.length > 0
                                ? orderedAddresses.findIndex(a => a.text === address.text) + 1
                                : "-"}
                        </div>
                        <Input
                            type="text"
                            value={address.text}
                            onChange={(e) => updateAddress(index, e.target.value)}
                            placeholder="Ingrese dirección"
                            className="flex-1"
                        />
                        <Button
                            onClick={() => removeAddress(index)}
                            className="bg-red-500 hover:bg-red-600"
                            aria-label="Eliminar dirección"
                        >
                            🗑️
                        </Button>
                    </div>
                ))}

                <div className="space-y-2 mt-4">
                    <Button
                        onClick={addAddress}
                        className="w-full bg-blue-500 hover:bg-blue-600"
                    >
                        ➕ Agregar Punto Intermedio
                    </Button>

                    <Button
                        onClick={calculateRoute}
                        className="w-full bg-green-500 hover:bg-green-600"
                        disabled={loading || !startPoint || !endPoint}
                    >
                        {loading ? "Calculando..." : "🛣️ Calcular Ruta"}
                    </Button>
                </div>

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

            <div className="w-2/3 relative">
                <div ref={mapContainer} className="w-full h-full" />
            </div>
        </div>
    );
}