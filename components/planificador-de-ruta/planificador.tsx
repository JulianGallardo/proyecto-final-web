"use client";

import { useState, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const API_KEY = "5b3ce3597851110001cf624882964b6d51a94e329e8f7d689d9f7767";

export default function RoutePlanner() {
    const mapContainer = useRef(null);
    const map = useRef<maplibregl.Map | null>(null);
    const [addresses, setAddresses] = useState<string[]>([]);
    const [vehicle, setVehicle] = useState("driving-car");
    const [loading, setLoading] = useState(false);
    const markersRef = useRef<maplibregl.Marker[]>([]);
    const routeLayers = useRef<string[]>([]);

    useEffect(() => {
        if (!map.current && mapContainer.current) {
            map.current = new maplibregl.Map({
                container: mapContainer.current,
                style: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
                center: [-62.267, -38.7196], // Bahía Blanca
                zoom: 12,
            });

            map.current.addControl(new maplibregl.NavigationControl(), "top-right");
        }
    }, []);

    const addAddress = () => setAddresses([...addresses, ""]);

    const updateAddress = (index: number, value: string) => {
        const newAddresses = [...addresses];
        newAddresses[index] = value;
        setAddresses(newAddresses);
    };

    const removeAddress = (index: number) => {
        const newAddresses = addresses.filter((_, i) => i !== index);
        setAddresses(newAddresses);
    };

    async function getCoordinates(address: string) {
        const bbox = "-62.5,-39.0,-61.5,-38.5";
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=AR&limit=1&bounded=1&viewbox=${bbox}`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.length > 0) {
            return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
        }
        return null;
    }

    async function calculateRoute() {
        if (addresses.length < 2) {
            alert("Debes ingresar al menos dos direcciones.");
            return;
        }

        setLoading(true);

        // Obtener coordenadas
        const locations: any[] = [];
        for (const address of addresses) {
            const coords = await getCoordinates(address);
            if (coords) locations.push(coords);
        }

        if (locations.length < 2) {
            alert("No se encontraron coordenadas para algunas direcciones.");
            setLoading(false);
            return;
        }

        // Optimizar el orden de las ubicaciones
        const optimizationUrl = `https://api.openrouteservice.org/v2/matrix/${vehicle}`;
        const resMatrix = await fetch(optimizationUrl, {
            method: "POST",
            headers: {
                "Authorization": API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ locations, metrics: ["duration"] }),
        });

        const matrixData = await resMatrix.json();
        const orderedIndices = optimizeRoute(matrixData.durations);
        const orderedLocations = orderedIndices.map((i) => locations[i]);

        // Obtener ruta óptima
        const routeUrl = `https://api.openrouteservice.org/v2/directions/${vehicle}/geojson`;
        const resRoute = await fetch(routeUrl, {
            method: "POST",
            headers: {
                "Authorization": API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ coordinates: orderedLocations }),
        });

        const data = await resRoute.json();
        setLoading(false);

        if (map.current) {
            map.current.flyTo({ center: orderedLocations[0] as [number, number], zoom: 13 });

            // ❌ Eliminar marcadores y rutas previas
            markersRef.current.forEach((marker) => marker.remove());
            markersRef.current = [];
            routeLayers.current.forEach((layer) => {
                if (map.current?.getLayer(layer)) {
                    map.current.removeLayer(layer);
                }
            });
            if (map.current.getSource("route")) {
                map.current.removeSource("route");
            }

            // 🏁 Agregar marcadores
            orderedLocations.forEach((coord, i) => {
                const marker = new maplibregl.Marker({ color: "red" })
                    .setLngLat(coord as [number, number])
                    .setPopup(new maplibregl.Popup().setText(`📍 ${addresses[orderedIndices[i]]}`))
                    .addTo(map.current as maplibregl.Map);
                markersRef.current.push(marker);
            });

            // 🎨 Dibujar la ruta con colores diferentes
            map.current.addSource("route", { type: "geojson", data });

            const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFAA33"];

            const coordinates = data.features[0].geometry.coordinates;
            for (let i = 0; i < orderedLocations.length - 1; i++) {
                const segment: GeoJSON.Feature = {
                    type: "Feature",
                    properties: { description: `De: ${addresses[orderedIndices[i]]} → ${addresses[orderedIndices[i + 1]]}` },
                    geometry: {
                        type: "LineString",
                        coordinates: coordinates.slice(i * 10, (i + 1) * 10 + 1),
                    },
                };

                const layerId = `route-line-${i}`;
                routeLayers.current.push(layerId);

                map.current.addLayer({
                    id: layerId,
                    type: "line",
                    source: { type: "geojson", data: segment },
                    layout: { "line-cap": "round", "line-join": "round" },
                    paint: {
                        "line-color": colors[i % colors.length],
                        "line-width": 4,
                        "line-opacity": 0.8,
                    },
                });

                map.current.on("mouseenter", layerId, (e) => {
                    if (map.current) {
                        map.current.getCanvas().style.cursor = "pointer";
                    }
                    new maplibregl.Popup()
                        .setLngLat(e.lngLat)
                        .setText(segment.properties?.description || "")
                        .addTo(map.current as maplibregl.Map);
                });

                map.current.on("mouseleave", layerId, () => {
                    if (map.current) {
                        map.current.getCanvas().style.cursor = "";
                    }
                });
            }
        }
    }

    function optimizeRoute(durations: number[][]) {
        const n = durations.length;
        const visited = new Array(n).fill(false);
        const route = [0]; // Comenzar desde la primera ubicación
        visited[0] = true;

        for (let i = 1; i < n; i++) {
            let last = route[route.length - 1];
            let next = -1;
            let minDistance = Infinity;

            for (let j = 0; j < n; j++) {
                if (!visited[j] && durations[last][j] < minDistance) {
                    next = j;
                    minDistance = durations[last][j];
                }
            }

            if (next !== -1) {
                route.push(next);
                visited[next] = true;
            }
        }

        return route;
    }

    return (
        <div className="flex h-screen w-full">
            <div className="w-1/3 p-6 bg-gray-100 shadow-lg">
                <h1 className="text-2xl font-bold mb-4">Planificador de Ruta</h1>

                <Select onValueChange={setVehicle} defaultValue={vehicle}>
                    <SelectTrigger className="w-full mb-2">
                        <SelectValue placeholder="Selecciona un vehículo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="driving-car">🚗 Auto</SelectItem>
                        <SelectItem value="cycling-regular">🚲 Bicicleta</SelectItem>
                        <SelectItem value="foot-walking">🚶 Caminata</SelectItem>
                    </SelectContent>
                </Select>

                {addresses.map((address, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                        <Input type="text" value={address} onChange={(e) => updateAddress(index, e.target.value)} />
                        <Button onClick={() => removeAddress(index)} className="bg-red-500">🗑️</Button>
                    </div>
                ))}

                <Button onClick={addAddress} className="w-full bg-blue-500 mb-2">➕ Agregar Dirección</Button>

                <Button onClick={calculateRoute} className="w-full bg-green-500">🛣️ Calcular Ruta</Button>
            </div>

            <div className="w-2/3"><div ref={mapContainer} className="w-full h-full"></div></div>
        </div>
    );
}
