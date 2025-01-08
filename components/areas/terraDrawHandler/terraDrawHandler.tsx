import { SidebarProvider } from "@/components/ui/sidebar";
import { useMap } from "@vis.gl/react-maplibre";
import { MaplibreTerradrawControl, TerradrawControlOptions } from "@watergis/maplibre-gl-terradraw";
import { useEffect, useMemo, useState } from "react";
import { generateTerraDrawOptions } from "../../../lib/mapUtils/terraDrawOptions";
import { ColorCache } from "@/lib/mapUtils/colorCache";
import MapControlPanel from "../ui/ControlPanel/ControlPanel";

export default function TerraDrawHandler() {
    const { mymap } = useMap(); // Hook para obtener el mapa
    const [draw, setDraw] = useState<MaplibreTerradrawControl | null>(null); // Estado para el controlador
    const colorCache = useMemo(() => new ColorCache(), []);

    useEffect(() => {
        if (!mymap) return;
        const terraDrawOptions: TerradrawControlOptions = generateTerraDrawOptions(colorCache);
        const newDraw = new MaplibreTerradrawControl(
            terraDrawOptions
        );
        mymap.addControl(newDraw);
        setDraw(newDraw);
        // Oculto el control de terradraw
        const mapControl = document.getElementsByClassName("maplibregl-ctrl maplibregl-ctrl-group")[0];
        mapControl.setAttribute("style", "visibility: hidden;");

    }, [mymap, colorCache]);

    if (!draw) return null;

    return (
        <SidebarProvider>
            <MapControlPanel draw={draw} colorCache={colorCache} />
        </SidebarProvider>
    )
}