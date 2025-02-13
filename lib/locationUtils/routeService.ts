
import { VehicleType, RouteSegment, Address } from '@/types/PlannerTypes';

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
        coordinates: [number, number][],
        vehicle: VehicleType
    ): Promise<RouteSegment[]> {
        const url = `https://api.openrouteservice.org/v2/directions/${vehicle}/geojson`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: this.API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ coordinates })
        });

        const data = await response.json();
        return this.createRouteSegments(
            orderedInstruments,
            data.features[0].geometry.coordinates,
            data.features[0].properties.segments
        );
    }

    private createRouteSegments(
        orderedInstruments: Address[],
        coordinates: [number, number][],
        segmentData: { distance: number; duration: number }[]
    ): RouteSegment[] {
        const segments: RouteSegment[] = [];
        const totalPoints = coordinates.length;

        if (orderedInstruments.length < 2 || totalPoints < 2) {
            console.warn("Advertencia: No hay suficientes instrumentos o coordenadas para segmentar la ruta.");
            return [];
        }

        let start = 0;
        let end = 0;

        for (let i = 0; i < orderedInstruments.length; i++) {
            const instrument = orderedInstruments[i];

            console.log("vuelta", orderedInstruments[i]);
            // Encontrar el índice más cercano a la coordenada del instrumento actual
            start = end ;
            if (instrument.coordinates) {
                end = this.findNearestIndex(instrument.coordinates, coordinates, start);
            } else {
                console.warn(`Instrument at index ${i} has undefined coordinates.`);
                end = start;
            }

            


            segments.push({
                start: i,
                end: i ,
                coordinates: coordinates.slice(start, end + 1 ), // Incluir el último punto
                description: `Tramo ${i + 1} → ${i + 2}`,
                distance: segmentData[i]?.distance || 0,
                duration: segmentData[i]?.duration || 0
            });
        }

        return segments;
    }

    /**
     * Encuentra el índice en `coordinates` que es más cercano a `targetCoord`
     */
    private findNearestIndex(targetCoord: [number, number] , coordinates: [number, number][], startIndex: number): number {
        

        console.log("targetCoord", targetCoord);

        let minDist = Infinity;
        let nearestIndex = startIndex;

        for (let i = startIndex; i < coordinates.length; i++) {
            const dist = this.calculateDistance(targetCoord, coordinates[i]);
            console.log("distancia", dist);
            if (dist < minDist) {
                minDist = dist;
                nearestIndex = i;
            }
        }

        return nearestIndex;
    }

    /**
     * Calcula la distancia euclidiana entre dos coordenadas
     */
    private calculateDistance(coord1: [number, number], coord2: [number, number]): number {
        const [lon1, lat1] = coord1;
        const [lon2, lat2] = coord2;
        return Math.sqrt((lon2 - lon1) ** 2 + (lat2 - lat1) ** 2);
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