"use client";

import * as React from "react";
import { Map as VisMap } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMemo } from "react";
import Sidebar from "@/components/areas/ui/ControlPanel";
import { MapProvider } from "@vis.gl/react-maplibre";

export default function Map() {
    const center = useMemo(
        () => ({ lat: -38.71825410658778, lng: -62.25946510517043 }),
        []
    );

    return (
        <div className="flex flex-row w-full h-full">
            <MapProvider>
                <Sidebar />
            </MapProvider>
            <div className="container ">
                <VisMap
                    initialViewState={{
                        longitude: center.lng,
                        latitude: center.lat,
                        zoom: 11.5,
                    }}
                    style={{ width: "100%", height: "100%" }}
                    mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
                />
            </div>
        </div>
    );
}
