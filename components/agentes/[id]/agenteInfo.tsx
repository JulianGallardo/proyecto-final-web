"use client";
import { getAgenteById } from "@/actions/agente-actions";
import { AgenteExtendidoDto } from "@/types/agenteTypes";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import EntregasRepartidor from "./entregas";
import { MapPinnedIcon } from "lucide-react";
import { FatCornerUpLeft, SadCircle, SkipBack } from "@mynaui/icons-react";
import SkeletonAgenteInfo from "./skeletonAgenteInfo";
import ZonesAgente from "./zones-agente";
import AgenteInfoSection from "./agenteInfoSection";

export default function AgenteInfo() {

    const [agente, setAgente] = useState({} as AgenteExtendidoDto);
    const [loading, setLoading] = useState(true);

    const pathname = usePathname();
    const router = useRouter();
    const id = pathname ? parseInt(pathname.split("/").pop() ?? '0', 10) : 0;

    useEffect(() => {
        getAgenteById(id).then((data) => {
            setAgente(data);
            setLoading(false);
        });
    }, []);



    if (loading) {
        return <SkeletonAgenteInfo />;
    }

    if (!agente) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
                <SadCircle className="w-16 h-16 text-gray-400 mb-4" />
                <h2 className="text-3xl font-bold text-gray-800">Agente no encontrado</h2>
                <p className="text-lg text-gray-600 mt-2">El agente que intentas buscar no existe.</p>
                <Button className="mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition mb-2" onClick={() => router.push("/agentes")}>
                    <span className="mr-2">Volver al listado</span>
                    <SkipBack className="w-6 h-6" />
                </Button>
            </div>

        );
    }

    return (
        <div className="max-w-full mx-auto p-6">


            <Button className="mt-6 px-4 py-2 bg-blue-600 text-white  rounded-lg hover:bg-blue-700 transition mb-2" onClick={() => router.push("/agentes")}>
                <span className="mr-2">Volver al listado</span>
                <FatCornerUpLeft className="w-6 h-6" />
            </Button>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Información del Agente</h2>

            <AgenteInfoSection agente={agente} />

            {agente.zonas.length === 0 && (
                <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 rounded-lg shadow-sm p-4">
                    <MapPinnedIcon className="w-12 h-12 text-gray-400 mx-auto" />
                    <p className="text-sm md:text-lg text-gray-400 font-semibold">El agente no tiene zonas asignadas.</p>
                </div>
            )
            }


            {
                agente.zonas.length > 0 &&
                <ZonesAgente agente={agente} />

            }


            <div className="mt-6 w-full">
                <h3 className="text-2xl font-bold text-gray-700">Historial de entregas</h3>
                <EntregasRepartidor agenteId={agente.id} />

            </div>


        </div>
    );
}
