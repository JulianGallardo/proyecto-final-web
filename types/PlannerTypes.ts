// types/route.ts
export interface Coordinates {
    lat: number;
    lng: number;
}

export interface Address {
    text: string;
    coordinates?: [number, number];
}

export interface RouteSegment {
    start: number;
    end: number;
    coordinates: [number, number][];
    description: string;
}

export interface MapMarker {
    coordinates: [number, number];
    number: number;
    description: string;
}

export type VehicleType = 'driving-car' | 'cycling-regular' | 'foot-walking';