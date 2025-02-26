import { VehicleType, RouteSegment, Address, RouteChoiceType } from '@/types/PlannerTypes';

export class RouteService {


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
        instrumentLocations: [number, number][],
        vehicle: VehicleType,
        startLocation?: [number, number],
        endLocation?: [number, number],
        

    ): Promise<number[][]> {
        const url = `https://api.openrouteservice.org/optimization`;

        
        const body = {
            jobs: instrumentLocations.map((location, index) => ({
                id: index,
                location
            })),
            vehicles: [{ 
                id: 1, 
                profile: vehicle,
                start: startLocation || instrumentLocations[0],
                end: endLocation || instrumentLocations[instrumentLocations.length - 1],
            }],
            options: {
                g: true
            }
        };



        const response = await fetch(url, {
            method: 'POST',
            headers: new Headers({
                Authorization: process.env.NOMINTAIM_API_KEY ?? '',
                'Content-Type': 'application/json'
            }),

            body: JSON.stringify(body)
        });

        const data = await response.json();
        

        const optimizedJobs = data.routes[0].steps;


        const optimizedRouteLocations:number[][] = optimizedJobs.map((job: { job: number, location:number[] }) => job.location);


        return optimizedRouteLocations;
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

       


        // Configurar la petición para la API de directions
        const url = `https://api.openrouteservice.org/v2/directions/${vehicle}/geojson`;
        const requestBody = {
            coordinates: waypoints,
            preference: routeChoice,
            instructions: true,
            language: 'es-es',
            instructions_format: 'text',

        };

        const response = await fetch(url, {
            method: 'POST',
            headers: new Headers({
                Authorization: process.env.NOMINTAIM_API_KEY ?? '',
                'Content-Type': 'application/json'
            }),
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
            routeCoordinates,
            segments,
            startIndex,
        );
    }

    private createRouteSegments(
        coordinates: [number, number][],
        segmentData: {
            distance: number; duration: number; steps: {
                way_points: number[];
                instruction: string;
            }[]
        }[],
        startIndex: number,
    ): RouteSegment[] {
        const segments: RouteSegment[] = [];

        for (let i = 0; i < segmentData.length; i++) {
            const segment = segmentData[i];
            const steps = segment.steps;

            // Encontrar los índices de inicio y fin para este segmento
            const segmentStart = i > 0 ? steps[0].way_points[0] : 0;
            const segmentEnd = steps[steps.length - 1].way_points[1];

            const segmentInstructions = steps.map(step => step.instruction);

            segments.push({
                start: startIndex + i,
                end: startIndex + i + 1,
                coordinates: coordinates.slice(segmentStart, segmentEnd + 1),
                description: `Tramo ${startIndex + i + 1} → ${startIndex + i + 2}`,
                distance: segment.distance,
                duration: segment.duration,
                instructions: segmentInstructions

            });
        }

        return segments;
    }

    private optimizeRoute(distance: number[][]): number[] {
        const n = distance.length;
        const visited = new Array(n).fill(false);
        const route = [0];
        visited[0] = true;

        for (let i = 1; i < n; i++) {
            const last = route[route.length - 1];
            let next = -1;
            let minDistance = Infinity;

            for (let j = 0; j < n; j++) {
                if (!visited[j] && distance[last][j] < minDistance) {
                    next = j;
                    minDistance = distance[last][j];
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