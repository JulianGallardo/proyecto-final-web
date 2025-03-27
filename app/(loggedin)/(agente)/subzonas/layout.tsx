"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MapProvider } from "@vis.gl/react-maplibre";

export default function AreaLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex flex-col h-full w-full ">
            <SidebarProvider className="flex flex-row h-full w-full">
                <MapProvider>

                    {children}
                </MapProvider>
            </SidebarProvider>
        </div>
    )


}