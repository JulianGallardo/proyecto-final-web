"use client";
import { getAgenteById } from "@/actions/agente-actions";
import { AgenteExtendidoDto } from "@/types/agenteTypes";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Map, MapProvider, useMap } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapBounds, MapCenter } from "@/types/MapTypes";
import { getAllZones } from "@/actions/zone-actions";
import { MaplibreTerradrawControl, TerradrawControlOptions } from "@watergis/maplibre-gl-terradraw";
import { generateTerraDrawOptions } from "@/lib/mapUtils/terraDrawOptions";
import { GeoJSONStoreFeatures } from "terra-draw";
import { ColorCache } from "@/lib/mapUtils/colorCache";

export default function AgenteInfo() {
    const { mymap } = useMap(); // Hook para obtener el mapa
    const [draw, setDraw] = useState<MaplibreTerradrawControl | null>(null); // Estado para el controlador
    const colorCache = new ColorCache();


    const [agente, setAgente] = useState<AgenteExtendidoDto>({} as AgenteExtendidoDto);
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

                const terraDrawOptions: TerradrawControlOptions = generateTerraDrawOptions(colorCache);
                const newDraw = new MaplibreTerradrawControl(
                    terraDrawOptions
                );
                mymap.addControl(newDraw);
                setDraw(newDraw);
                // Oculto el control de terradraw
                const mapControl = document.getElementsByClassName("maplibregl-ctrl maplibregl-ctrl-group")[0];
                mapControl.setAttribute("style", "visibility: hidden;");

                const zonesToDraw = await getAllZones();

                console.log(zonesToDraw);

                const filteredZones = zonesToDraw.filter((zone) => {
                    return agente.zonas.some((zona) => zona.id === zone.id);
                });

                console.log(filteredZones);

                filteredZones.forEach((zone) => {
                    const newZone = {
                        id: zone.id,
                        type: "Feature",
                        geometry: {
                            type: "Polygon",
                            coordinates: zone.geometry.coordinates
                        },
                        properties: {
                            mode: "polygon",
                            color: zone.properties.color,
                            name: zone.properties.name
                        },
                    } as GeoJSONStoreFeatures;

                    colorCache.saveDataToColorCache(`"${zone.id}"`, zone.properties.color);

                    draw?.getTerraDrawInstance().addFeatures([newZone]);

                });

            }
        };

        fetchData();
    }, [agente,mymap]);

    if (loading) {
        return <p className="text-center text-gray-500">Cargando...</p>;
    }

    return (
            <div className="w-full h-fit mx-auto p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Información del Agente</h2>

                <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                    <p className="text-lg"><span className="font-semibold">Nombre:</span> {agente.user.name}</p>
                    <p className="text-lg"><span className="font-semibold">Email:</span> {agente.user.email}</p>
                </div>

                <div className="container flex flex-col w-screen h-screen ">
                    <h3 className="text-2xl font-bold text-gray-700 mt-6">Zonas Asignadas</h3>
                    <ul className="mt-2">
                        {agente.zonas.map((zona) => (
                            <li key={zona.id} className="p-3 my-2 bg-gray-50 rounded-lg shadow-sm border-l-4"
                                style={{ borderColor: zona.zoneColor }}>
                                <p className="text-lg"><span className="font-semibold">Zona:</span> {zona.zoneName}</p>

                            </li>
                        ))}

                    </ul>
                    <Map
                        id={`mymap`}
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

                <button
                    className="mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                    onClick={() => router.back()}
                >
                    Volver
                </button>
            </div>

    );
}
