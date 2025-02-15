import { VehicleType, RouteSegment, Address, RouteChoiceType } from '@/types/PlannerTypes';

export class RouteService {
    private readonly API_KEY = "5b3ce3597851110001cf624882964b6d51a94e329e8f7d689d9f7767";

    public async getCoordinates(address: string): Promise<[number, number] | null> {
        const bbox = "-62.5,-39.0,-61.5,-38.5";
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            address
        )}&countrycodes=AR&limit=1&bounded=1&viewbox=${bbox}`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.length > 0) {
            return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
        }
        return null;
    }

    public async getOptimizedRoute(
        locations: [number, number][],
        vehicle: VehicleType
    ): Promise<number[]> {
        const url = `https://api.openrouteservice.org/v2/matrix/${vehicle}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: this.API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ locations, metrics: ['duration'] })
        });

        const data = await response.json();
        return this.optimizeRoute(data.durations);
    }

    public async getRouteGeometry(
        orderedInstruments: Address[],
        routeChoice: RouteChoiceType,
        vehicle: VehicleType,
        ordenNumber?: number
    ): Promise<RouteSegment[]> {
        // Filtrar los instrumentos desde el ordenNumber si existe
        const startIndex = ordenNumber 
            ? orderedInstruments.findIndex(i => i.stopNumber === ordenNumber)
            : 0;
        
        const relevantInstruments = ordenNumber 
            ? orderedInstruments.slice(startIndex)
            : orderedInstruments;

        // Verificar que tenemos suficientes instrumentos
        if (relevantInstruments.length < 2) {
            console.warn("No hay suficientes instrumentos para crear una ruta.");
            return [];
        }

        // Extraer las coordenadas de los instrumentos relevantes
        const waypoints = relevantInstruments
            .filter(instrument => instrument.coordinates)
            .map(instrument => instrument.coordinates as [number, number]);

        // Obtener el orden optimizado de los waypoints
        const optimizedIndices = await this.getOptimizedRoute(waypoints, vehicle);
        
        // Reordenar los waypoints según la optimización
        const optimizedWaypoints = optimizedIndices.map(index => waypoints[index]);
        
        // Reordenar los instrumentos según la optimización
        const optimizedInstruments = optimizedIndices.map(index => relevantInstruments[index]);

        console.log(optimizedWaypoints.map((c, i) => ({ c, i })));

        // Configurar la petición para la API de directions
        const url = `https://api.openrouteservice.org/v2/directions/${vehicle}/geojson`;
        const requestBody = {
            coordinates: optimizedWaypoints,
            preference: routeChoice,
            
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: this.API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (!data.features?.[0]?.properties?.segments) {
            console.error("No se pudo obtener la ruta");
            return [];
        }

        // Crear los segmentos de ruta con los datos recibidos
        const routeCoordinates = data.features[0].geometry.coordinates;
        const segments = data.features[0].properties.segments;

        return this.createRouteSegments(
            optimizedInstruments,
            routeCoordinates,
            segments,
            startIndex
        );
    }

    private createRouteSegments(
        orderedInstruments: Address[],
        coordinates: [number, number][],
        segmentData: { distance: number; duration: number; steps: {
            way_points: number[];
        }[] }[],
        startIndex: number
    ): RouteSegment[] {
        const segments: RouteSegment[] = [];

        for (let i = 0; i < segmentData.length; i++) {
            const segment = segmentData[i];
            const steps = segment.steps;
            
            // Encontrar los índices de inicio y fin para este segmento
            const segmentStart = i > 0 ? steps[0].way_points[0] : 0;
            const segmentEnd = steps[steps.length - 1].way_points[1];

            segments.push({
                start: startIndex + i,
                end: startIndex + i + 1,
                coordinates: coordinates.slice(segmentStart, segmentEnd + 1),
                description: `Tramo ${startIndex + i + 1} → ${startIndex + i + 2}`,
                distance: segment.distance,
                duration: segment.duration
            });
        }

        return segments;
    }

    private optimizeRoute(durations: number[][]): number[] {
        const n = durations.length;
        const visited = new Array(n).fill(false);
        const route = [0];
        visited[0] = true;

        for (let i = 1; i < n; i++) {
            const last = route[route.length - 1];
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
}