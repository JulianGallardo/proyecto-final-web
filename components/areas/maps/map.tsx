"use client";

import * as React from "react";
import { Map } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMemo } from "react";
import Sidebar from "@/components/areas/ui/ControlPanel";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Areas() {
    const center = useMemo(
        () => ({ lat: -38.71825410658778, lng: -62.25946510517043 }),
        []
    );

    return (
        <div className="flex flex-row w-full h-full ">
            <SidebarProvider className="flex flex-row  bg-gray-100 border-r border-gray-200">
                <Sidebar />
                <SidebarTrigger className="flex items-center justify-center h-full " />
            </SidebarProvider>
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
