"use client";
import { getAgenteById } from "@/actions/agente-actions";
import { AgenteExtendidoDto } from "@/types/agenteTypes";
import { Map } from "maplibre-gl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AgenteInfo() {
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

    if (loading) {
        return <p className="text-center text-gray-500">Cargando...</p>;
    }

    return (
        <div className="w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Información del Agente</h2>
            
            <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                <p className="text-lg"><span className="font-semibold">Nombre:</span> {agente.user.name}</p>
                <p className="text-lg"><span className="font-semibold">Email:</span> {agente.user.email}</p>
            </div>

            <h3 className="text-2xl font-bold text-gray-700 mt-6">Zonas Asignadas</h3>
            <ul className="mt-2">
                {agente.zonas.map((zona) => (
                    <li key={zona.id} className="p-3 my-2 bg-gray-50 rounded-lg shadow-sm border-l-4" 
                        style={{ borderColor: zona.zoneColor }}>
                        <p className="text-lg"><span className="font-semibold">Zona:</span> {zona.zoneName}</p>
                        <Map
                            container="map"
                            center={[zona.longitude, zona.latitude]}
                            zoom={12}
                            style="mapbox://styles/mapbox/streets-v11"
                        />
                    </li>
                ))}
            </ul>

            <button 
                className="mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                onClick={() => router.back()}
            >
                Volver
            </button>
        </div>
    );
}
