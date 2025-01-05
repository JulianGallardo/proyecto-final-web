"use client";

import * as React from "react";
import { Map } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMemo } from "react";
import { ClipLoader } from "react-spinners";
import TerraDrawHandler from "../terraDrawHandler/terraDrawHandler";

export default function Areas() {
    const center = useMemo(
        () => ({ lat: -38.71825410658778, lng: -62.25946510517043 }),
        []
    );



    return (
        <div className="flex flex-row w-full h-full ">
            <TerraDrawHandler />
            <Map
                id="mymap"
                initialViewState={{
                    longitude: center.lng,
                    latitude: center.lat,
                    zoom: 11.5,
                }}
                style={{ width: "100%", height: "100%" }}
                mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"

            />
        </div>
    );
}


export function LoadSkeleton() {
    return (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
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
