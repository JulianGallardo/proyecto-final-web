
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
        vehicle: VehicleType,
        ordenNumber?: number
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
            data.features[0].properties.segments,
            ordenNumber
        );
    }

    private createRouteSegments(
        orderedInstruments: Address[],
        coordinates: [number, number][],
        segmentData: { distance: number; duration: number }[],
        lastVisitedOrder?: number
    ): RouteSegment[] {
        const segments: RouteSegment[] = [];
        
        

        if (orderedInstruments.length < 2) {
            console.warn("No hay suficientes instrumentos para segmentar la ruta.");
            return [];
        }

    
        // Si tenemos lastVisitedOrder, filtramos desde ese punto
        const startIndex = lastVisitedOrder ? orderedInstruments.findIndex((i) => i.stopNumber === lastVisitedOrder) : orderedInstruments.findIndex((i) => i.type === 'start');
    


        // Si el índice es inválido o es el último elemento, retornamos array vacío
        if (startIndex === -1 || startIndex === orderedInstruments.length - 1) {
            console.warn("Índice de inicio inválido o es el último elemento.");
            return [];
        }
    
        // Tomamos solo los instrumentos desde el punto de inicio
        const relevantInstruments = orderedInstruments.slice(startIndex);
        
        let start = 0;
        let end = 0;
    
        for (let i = 0; i < relevantInstruments.length - 1; i++) {
            const currentInstrument = relevantInstruments[i];
            const nextInstrument = relevantInstruments[i + 1];
    
            // Establecemos el punto de inicio usando las coordenadas del instrumento actual
            if (i === 0 && currentInstrument.coordinates) {
                start = this.findNearestIndex(currentInstrument.coordinates, coordinates, 0);
            }
    
            if (nextInstrument.coordinates) {
                end = this.findNearestIndex(nextInstrument.coordinates, coordinates, start);
            } else {
                console.warn(`Instrument at index ${i + 1} has undefined coordinates.`);
                end = start;
            }
    
            segments.push({
                start: startIndex + i,
                end: startIndex + i + 1,
                coordinates: coordinates.slice(start, end + 1),
                description: `Tramo ${startIndex + i + 1} → ${startIndex + i + 2}`,
                distance: segmentData[i]?.distance || 0,
                duration: segmentData[i]?.duration || 0
            });
    
            start = end;
        }
    
        return segments;
    }
    
    /**
     * Encuentra el índice en `coordinates` que es más cercano a `targetCoord`
     */
    private findNearestIndex(targetCoord: [number, number] , coordinates: [number, number][], startIndex: number): number {
        


        let minDist = Infinity;
        let nearestIndex = startIndex;

        for (let i = startIndex; i < coordinates.length; i++) {
            const dist = this.calculateDistance(targetCoord, coordinates[i]);
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