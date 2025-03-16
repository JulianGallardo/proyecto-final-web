
import { type HexColor, type GeoJSONStoreFeatures } from 'terra-draw';

export const MapCenter = { lat: -38.71825410658778, lng: -62.25946510517043 }

export const MapBounds = [ //reestringidas a 100 km a la redonda de la ciudad de Bahía Blanca
    [-63.415665, -39.619154], // Southwest coordinates
    [-61.103265, -37.817354] // Northeast coordinates
];

export type HexColorStyling = HexColor;
export type FeatureId = string | number;
export type Position = [number, number];
export enum DrawingModes {
    SinSeleccionar = "Sin seleccionar",
    EditandoZonas = "Editando Zonas",
    CreandoZonas = "Creando Zona",
}

export interface CustomFeature extends GeoJSONStoreFeatures {
    properties: {
        color: HexColorStyling;
        name: string;
    };
}

export interface Subzone {
    name: string;
    polygon: any;

}

export interface OnFinishContext {
    action: string, mode: string
}

