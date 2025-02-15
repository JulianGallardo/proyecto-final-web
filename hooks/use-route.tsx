import { create } from 'zustand';
import { RouteService } from "@/lib/locationUtils/routeService";
import { VehicleType, Address, RouteSegment, RouteChoiceType } from "@/types/PlannerTypes";
import { InstrumentoExtendido } from "@/types/instrumentoTypes";
import { useEffect } from 'react'

interface RouteState {
    orderedAddresses: Address[];
    vehicle: VehicleType;
    loading: boolean;
    startPoint: string;
    endPoint: string;
    routeMetrics: { distance: number; duration: number } | null;
    selectedInstruments: InstrumentoExtendido[];
    routeSegments: RouteSegment[];
    routeChoice: RouteChoiceType;

    // Actions

    setOrderedAddresses: (addresses: Address[]) => void;
    setVehicle: (vehicle: VehicleType) => void;
    setLoading: (loading: boolean) => void;
    setStartPoint: (point: string) => void;
    setEndPoint: (point: string) => void;
    setRouteMetrics: (metrics: { distance: number; duration: number } | null) => void;
    setSelectedInstruments: (instruments: InstrumentoExtendido[]) => void;
    setRouteSegments: (segments: RouteSegment[]) => void;
    calculateRoute: () => Promise<void>;
    markAsVisited: (stopNumber: number) => Promise<void>;
    recalculateRoute: (stopNumber?: number) => Promise<void>;
    setRouteChoice: (choice: RouteChoiceType) => void;
}

const routeService = new RouteService();

export const useRouteStore = create<RouteState>((set, get) => ({
    orderedAddresses: [],
    vehicle: "driving-car",
    loading: false,
    startPoint: "",
    endPoint: "",
    routeMetrics: null,
    selectedInstruments: [],
    routeSegments: [],
    routeChoice: "fastest",

    setRouteChoice: (choice) => set({ routeChoice: choice }),
    setOrderedAddresses: (addresses) => set({ orderedAddresses: addresses }),
    setVehicle: (vehicle) => set({ vehicle }),
    setLoading: (loading) => set({ loading }),
    setStartPoint: (point) => set({ startPoint: point }),
    setEndPoint: (point) => set({ endPoint: point }),
    setRouteMetrics: (metrics) => set({ routeMetrics: metrics }),
    setSelectedInstruments: (instruments) => set({ selectedInstruments: instruments }),
    setRouteSegments: (segments) => set({ routeSegments: segments }),

    calculateRoute: async () => {
        const {
            selectedInstruments,
            vehicle,
            routeChoice,
            startPoint,
            endPoint,
            setOrderedAddresses,
            setRouteMetrics,
            setRouteSegments,
            setLoading
        } = get();

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

            const allAddresses = instrumentAddresses;

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
                routeChoice,
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
    },

    markAsVisited: async (stopNumber) => {
        const {
            orderedAddresses,
            setOrderedAddresses,
            recalculateRoute
        } = get();

        const hasStart = orderedAddresses.some((addr) => addr.type === "start");

        if (hasStart) {
            setOrderedAddresses(
                orderedAddresses.map((addr) =>
                    addr.type === "start" ? { ...addr, visited: true } : addr
                )
            );
        }

        setOrderedAddresses(
            orderedAddresses.map((addr) =>
                addr.stopNumber === stopNumber ? { ...addr, visited: true } : addr
            )
        );

        await recalculateRoute(stopNumber);
    },

    recalculateRoute: async (stopNumber?: number) => {
        const {
            orderedAddresses,
            vehicle,
            setRouteMetrics,
            setRouteSegments,
            routeChoice
        } = get();

        const hasStart = orderedAddresses.some((addr) => addr.type === "start");

        let ordered = orderedAddresses.map((addr) =>
            addr.stopNumber === stopNumber ? { ...addr, visited: true } : addr
        );

        if (hasStart) {
            ordered = ordered.filter((addr) => addr.type !== "start");
        }

        const routeSegments = await routeService.getRouteGeometry(
            ordered,
            routeChoice,
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
}));

export const useRoutePlanner = (instruments: InstrumentoExtendido[]) => {
    const {
        orderedAddresses,
        setOrderedAddresses,
        setRouteSegments,
        vehicle,
        loading,
        startPoint,
        endPoint,
        routeMetrics,
        selectedInstruments,
        routeSegments,
        setSelectedInstruments,
        calculateRoute,
        markAsVisited,
        setStartPoint,
        setEndPoint,
        setVehicle,
        routeChoice,
        setRouteChoice
    } = useRouteStore();

    useEffect(() => {
        setSelectedInstruments(instruments);
    }, [instruments, setSelectedInstruments]);

    const canFinish = orderedAddresses.length > 0 &&
        orderedAddresses.every((addr) => addr.visited || addr.type === "end");

    return {
        routeChoice,
        setRouteChoice,
        orderedAddresses,
        setOrderedAddresses,
        setRouteSegments,
        vehicle,
        loading,
        startPoint,
        endPoint,
        routeMetrics,
        selectedInstruments,
        routeSegments,
        canFinish,
        calculateRoute,
        markAsVisited,
        setStartPoint,
        setEndPoint,
        setVehicle
    };
};