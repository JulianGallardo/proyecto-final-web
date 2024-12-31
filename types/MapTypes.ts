export type HexColorStyling = `#${string}`;
export type FeatureId = string;
export enum DrawingModes {
    SinSeleccionar = "Sin seleccionar",
    EditandoZonas = "Editando Zonas",
    CreandoZonas = "Creando Zona",
}

export interface CustomFeature extends GeoJSON.Feature {
    id: string;
    properties: {
        color: HexColorStyling;
        name: string;
    };
}