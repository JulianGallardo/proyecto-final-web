import { InstrumentoExtendido } from "./instrumentoTypes";

// types/route.ts
export interface Coordinates {
    lat: number;
    lng: number;
}

export type RouteChoiceType = "fastest" | "shortest" ;

export interface Address {
    type: 'start' | 'end' | 'waypoint';
    stopNumber: number; 
    text: string;
    coordinates?: [number, number];
    instrument?: InstrumentoExtendido;
    visited: boolean;
}

export interface RouteSegment {
    start: number;
    end: number;
    coordinates: [number, number][];
    description: string;
    distance: number;
    duration: number;
    instructions: string[];
}


export type VehicleType = 'driving-car' | 'cycling-regular' | 'foot-walking';