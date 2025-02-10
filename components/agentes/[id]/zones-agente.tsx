
import { AgenteExtendidoDto } from "@/types/agenteTypes";
import "maplibre-gl/dist/maplibre-gl.css";
import MapView from "../zonas/MapView";
import { CustomFeature } from "@/types/MapTypes";

interface ZonesAgenteProps {
    agente: AgenteExtendidoDto;
    zonasBDD: CustomFeature[];
}

export default function ZonesAgente({ agente, zonasBDD }: Readonly<ZonesAgenteProps>) {


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
                        <MapView zonasBDD={zonasBDD} agente={agente} />
                    </div>

                </div>
            </div>


        </div>
    )
}