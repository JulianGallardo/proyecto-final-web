"use client";

import { useMap } from "@vis.gl/react-maplibre";
import { MaplibreTerradrawControl, TerradrawControlOptions } from "@watergis/maplibre-gl-terradraw";
import { useEffect, useMemo, useState } from "react";
import { generateTerraDrawOptions } from "@/lib/mapUtils/terraDrawOptions";
import { ColorCache } from "@/lib/mapUtils/colorCache";
import { ExtendedZone } from "@/types/ZoneTypes";
import EditSidePanelSubzones from "./editSidePanel";


interface TerraDrawHandlerSubZonasProps {
    selectedZone: ExtendedZone;
    exitEditMode: () => void;
    setLoading: (loading: boolean) => void;


}


export default function TerraDrawHandlerSubZonas(
    { selectedZone,exitEditMode,setLoading }: Readonly<TerraDrawHandlerSubZonasProps>
) {

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

        return () => {
            mymap.removeControl(newDraw);
        };

    }, [mymap, colorCache]);

    
    if (!draw) return null;


    return (
        <div className="flex flex-row w-full h-full">
            <EditSidePanelSubzones
                setLoading={setLoading}
                zone={selectedZone}
                colorCache={colorCache}
                draw={draw}
                exitEditMode={exitEditMode}
            />
        </div>
    )

}