import {type HexColor, type GeoJSONStoreFeatures } from 'terra-draw';




export type HexColorStyling = HexColor;
export type FeatureId = string | number ;
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