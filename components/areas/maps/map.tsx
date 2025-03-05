"use client";
export const dynamic = 'force-dynamic'

import * as React from "react";
import { Layer, Map, Source, FullscreenControl, NavigationControl } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { ClipLoader } from "react-spinners";
import TerraDrawHandler from "../terraDrawHandler/terraDrawHandler";
import { MapCenter, MapBounds } from "@/types/MapTypes";

export default function Areas() {


    return (
        <div className="flex flex-row w-full h-full ">
            <TerraDrawHandler />
            <Map
                id="mymap"
                initialViewState={{
                    longitude: MapCenter.lng,
                    latitude: MapCenter.lat,
                    zoom: 11.5,
                }}

                maxBounds={MapBounds}


                style={{ width: "100%", height: "100%" }}
                mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"

            >   
                <FullscreenControl style={{ position: 'absolute', top: 0, left: 0 }} />
                <NavigationControl  style={{ position: 'absolute', top: 35, left: 0 }} />
                <Source
                    id="zone-labels"
                    type="geojson"
                    data={{
                        type: "FeatureCollection",
                        features: []
                    }}
                />
                <Layer
                    id="terra-draw-text"
                    type="symbol"
                    source="zone-labels"  // Usamos la fuente 'zone-labels'
                    layout={{
                        "text-field": ["get", "name"],  // Extraemos el nombre de la propiedad
                        "text-size": 14,
                        "text-anchor": "center",  // Alineación del texto
                        "text-offset": [0, 0]  // Evitar desplazamiento
                    }}
                    paint={{
                        "text-color": "#000000",  // Color del texto
                        "text-halo-color": "#ffffff",  // Color del halo (fondo blanco)
                        "text-halo-width": 2,  // Ancho del halo
                    }}
                />
            </Map>

        </div>
    );
}


export function LoadSkeleton() {
    return (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center h-full w-full z-50">
            <div className="flex flex-col items-center">
                <ClipLoader
                    loading
                    size={50}
                    speedMultiplier={1}
                    color="#ffffff"
                />
            </div>
        </div>

    );

}
