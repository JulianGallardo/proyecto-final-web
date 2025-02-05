"use client";
import { getAgenteById } from "@/actions/agente-actions";
import { AgenteExtendidoDto } from "@/types/agenteTypes";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Map, useMap } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapBounds, MapCenter } from "@/types/MapTypes";
import { getAllZones } from "@/actions/zone-actions";
import { MaplibreTerradrawControl } from "@watergis/maplibre-gl-terradraw";
import { generateTerraDrawOptions } from "@/lib/mapUtils/terraDrawOptions";
import { GeoJSONStoreFeatures } from "terra-draw";
import { ColorCache } from "@/lib/mapUtils/colorCache";
import { Button } from "@/components/ui/button";
import EntregasRepartidor from "./entregas";
import { MapPinnedIcon } from "lucide-react";
import { SkipBack } from "@mynaui/icons-react";
import SkeletonAgenteInfo from "./skeletonAgenteInfo";

export default function AgenteInfo() {
    const { mymap } = useMap();
    const [draw, setDraw] = useState<MaplibreTerradrawControl | null>(null);
    const colorCache = new ColorCache();
    const [agente, setAgente] = useState({} as AgenteExtendidoDto);
    const [loading, setLoading] = useState(true);

    const pathname = usePathname();
    const router = useRouter();
    const id = parseInt(pathname.split("/")[2], 10);

    useEffect(() => {
        getAgenteById(id).then((data) => {
            setAgente(data);
            setLoading(false);
        });
    }, []);

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
            }
        };
        fetchData();
    }, [agente, mymap]);

    if (loading) {
        return <SkeletonAgenteInfo />;
    }

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <Button className="mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition mb-2" onClick={() => router.push("/agentes")}>
                <span className="mr-2">Volver al listado</span>
                <SkipBack className="w-6 h-6" />
            </Button>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Información del Agente</h2>

            <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                <p className="text-lg"><span className="font-semibold">Nombre:</span> {agente.user.name}</p>
                <p className="text-lg"><span className="font-semibold">Email:</span> {agente.user.email}</p>
            </div>

            {agente.zonas.length === 0 && (
                <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 rounded-lg shadow-sm p-4">
                    <MapPinnedIcon className="w-12 h-12 text-gray-400 mx-auto" />
                    <p className="text-sm md:text-lg text-gray-400 font-semibold">El agente no tiene zonas asignadas.</p>
                </div>
            )
            }


            {
                agente.zonas.length > 0 &&
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
                            <Map
                                id="mymap"
                                initialViewState={{ longitude: MapCenter.lng, latitude: MapCenter.lat, zoom: 11.5 }}
                                maxBounds={MapBounds}
                                style={{ width: "100%", height: "100%" }}
                                mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
                            />
                        </div>
                    </div>


                </div>
            }


            <div className="mt-6 w-full">
                <h3 className="text-2xl font-bold text-gray-700">Historial de entregas</h3>
                <EntregasRepartidor agenteId={agente.id} />

            </div>


        </div>
    );
}
