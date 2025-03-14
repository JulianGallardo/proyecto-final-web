"use client";
import { MapProvider } from "@vis.gl/react-maplibre";

export default function AreaLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex flex-col h-full w-full ">
                <MapProvider>
                    {children}
                </MapProvider>
        </div>
    )


}