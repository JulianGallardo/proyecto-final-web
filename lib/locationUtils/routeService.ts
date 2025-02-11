// services/RouteService.ts
import { VehicleType, RouteSegment } from '@/types/PlannerTypes';

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
            data.features[0].geometry.coordinates,
            data.features[0].properties.segments,
            coordinates.length
        );
    }
    
    private createRouteSegments(
        coordinates: [number, number][],
        segmentData: { distance: number; duration: number }[],
        numStops: number
    ): RouteSegment[] {
        const segments: RouteSegment[] = [];
        const totalPoints = coordinates.length;
    
        for (let i = 0; i < numStops - 1; i++) {
            const start = Math.floor((i * (totalPoints - 1)) / (numStops - 1));
            const end = Math.floor(((i + 1) * (totalPoints - 1)) / (numStops - 1));
    
            segments.push({
                start: i,
                end: i + 1,
                coordinates: coordinates.slice(start, end + 1), // Include end point
                description: `Tramo ${i + 1} → ${i + 2}`,
                distance: segmentData[i]?.distance || 0, // Ensure valid values
                duration: segmentData[i]?.duration || 0
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
}