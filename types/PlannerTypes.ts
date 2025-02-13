import { InstrumentoExtendido } from "./instrumentoTypes";

// types/route.ts
export interface Coordinates {
    lat: number;
    lng: number;
}

export interface Address {
    text: string;
    coordinates?: [number, number];
    instrument?: InstrumentoExtendido;
}

export interface RouteSegment {
    start: number;
    end: number;
    coordinates: [number, number][];
    description: string;
    distance: number;
    duration: number;
}

export interface MapMarker {
    type: 'start' | 'end' | 'stop';
    coordinates: [number, number];
    number: number;
    description: string;
}

export type VehicleType = 'driving-car' | 'cycling-regular' | 'foot-walking';