import { getAllZones } from "@/actions/zone-actions";
import { ColorCache } from "@/lib/mapUtils/colorCache";
import { generateTerraDrawOptions } from "@/lib/mapUtils/terraDrawOptions";
import { AgenteExtendidoDto } from "@/types/agenteTypes";
import { MapCenter, MapBounds } from "@/types/MapTypes";

import { MaplibreTerradrawControl } from "@watergis/maplibre-gl-terradraw";
import { useState, useEffect } from "react";
import { GeoJSONStoreFeatures } from "terra-draw";
import "maplibre-gl/dist/maplibre-gl.css";
import { ClipLoader } from "react-spinners";
import { useMap, Map } from "@vis.gl/react-maplibre";

interface ZonesAgenteProps {
    agente: AgenteExtendidoDto;
}

export default function MapView() {
    const { mymap } = useMap();
    const [draw, setDraw] = useState<MaplibreTerradrawControl | null>(null);
    const colorCache = new ColorCache();
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            if (mymap) {
                const terraDrawOptions = generateTerraDrawOptions(colorCache);
                const newDraw = new MaplibreTerradrawControl(terraDrawOptions);
                mymap.addControl(newDraw);
                setDraw(newDraw);

                console.log("Mapa cargado");

                document.querySelectorAll(".maplibregl-ctrl-group").forEach(ctrl => {
                    (ctrl as HTMLElement).style.visibility = "hidden";
                });

                const zonesToDraw = await getAllZones();

                zonesToDraw.forEach(zone => {
                    const newZone = {
                        id: zone.id,
                        type: "Feature",
                        geometry: { type: "Polygon", coordinates: zone.geometry.coordinates },
                        properties: { mode: "polygon", color: zone.properties.color, name: zone.properties.name },
                    } as GeoJSONStoreFeatures;

                    colorCache.saveDataToColorCache(`"${zone.id}"`, zone.properties.color);
                    draw?.getTerraDrawInstance().addFeatures([newZone]);
                });
                setLoading(false);
            }
        };
        fetchData();
    }, [mymap]);
    return (
        <div className="flex flex-col w-full h-[500px]">
            <div className="flex flex-col md:flex-row w-full h-full gap-2">
                <div className="w-full h-full  flex flex-col md:flex-row  gap-2">
                    <div className="w-full h-full relative rounded-lg">
                        {loading && (
                            <div className="absolute inset-0 bg-gray-500 bg-opacity-75 flex flex-row items-center justify-center z-10">

                                <ClipLoader
                                    loading
                                    size={50}
                                    speedMultiplier={1}
                                    color="#ffffff"
                                />
                            </div>
                        )}
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

                        />
                    </div>

                </div>
            </div>


        </div>
    )
}