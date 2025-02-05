import { getAllZones } from "@/actions/zone-actions";
import { ColorCache } from "@/lib/mapUtils/colorCache";
import { generateTerraDrawOptions } from "@/lib/mapUtils/terraDrawOptions";
import { AgenteExtendidoDto } from "@/types/agenteTypes";
import { MapCenter, MapBounds } from "@/types/MapTypes";
import { useMap, Map } from "@vis.gl/react-maplibre";
import { MaplibreTerradrawControl } from "@watergis/maplibre-gl-terradraw";
import { useState, useEffect } from "react";
import { GeoJSONStoreFeatures } from "terra-draw";
import "maplibre-gl/dist/maplibre-gl.css";
import { Spinner } from "@mynaui/icons-react";
import { ClipLoader } from "react-spinners";

interface ZonesAgenteProps {
    agente: AgenteExtendidoDto;
}

export default function ZonesAgente({ agente }: Readonly<ZonesAgenteProps>) {
    const { mymap } = useMap();
    const [draw, setDraw] = useState<MaplibreTerradrawControl | null>(null);
    const colorCache = new ColorCache();
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            if (agente.id !== undefined && mymap) {
                const terraDrawOptions = generateTerraDrawOptions(colorCache);
                const newDraw = new MaplibreTerradrawControl(terraDrawOptions);
                mymap.addControl(newDraw);
                setDraw(newDraw);

                document.querySelectorAll(".maplibregl-ctrl-group").forEach(ctrl => {
                    (ctrl as HTMLElement).style.visibility = "hidden";
                });

                const zonesToDraw = await getAllZones();
                const filteredZones = zonesToDraw.filter(zone => agente.zonas.some(z => z.id === zone.id));

                filteredZones.forEach(zone => {
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
    }, [agente, mymap]);
    return (
        <div className="flex flex-col w-full h-[500px]">

            <h3 className="text-2xl font-bold text-gray-700 mt-6">Zonas Asignadas</h3>
            <div className="flex flex-col md:flex-row w-full h-full gap-2">
                <div className="w-full h-full  flex flex-col md:flex-row  gap-2">
                    <ul className="w-full md:w-1/3 h-fit md:overflow-y-auto ">
                        {agente.zonas.map(zona => (
                            <li key={zona.id} className="p-3 my-2 bg-gray-50 rounded-lg shadow-sm border-l-4" style={{ borderColor: zona.zoneColor }}>
                                <p className="text-lg"><span className="font-semibold">Zona:</span> {zona.zoneName}</p>
                            </li>
                        ))}
                    </ul>
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
                                zoom: 11.5
                            }}
                            maxBounds={MapBounds}
                            style={{ width: "100%", height: "100%", borderRadius: "0.5rem" }}
                            mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
                        />
                    </div>

                </div>
            </div>


        </div>
    )
}