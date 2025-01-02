"use client";

import * as React from "react";
import { Map } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Suspense, useMemo } from "react";
import Sidebar from "@/components/areas/ui/ControlPanel/ControlPanel";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Areas() {
    const center = useMemo(
        () => ({ lat: -38.71825410658778, lng: -62.25946510517043 }),
        []
    );

    return (
        <div className="flex flex-row w-full h-full ">
            <Suspense fallback={<LoadSkeleton />}>
                <SidebarProvider className="flex flex-row  bg-gray-100 border-r border-gray-200">
                    <Sidebar />
                </SidebarProvider>

            </Suspense>
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


function LoadSkeleton() {
    return (
        <div className="absolute inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
            <div className="flex flex-col items-center">
                <svg
                    className="animate-spin h-10 w-10 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                </svg>
                <p className="text-white mt-2">Cargando...</p>
            </div>
        </div>

    );

}
