import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonAgenteInfo(){
    return (
        <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <Skeleton className="h-10 w-48 mb-4" /> {/* Botón de volver */}
            <Skeleton className="h-8 w-64 mb-6" /> {/* Título de la página */}
            <Skeleton className="h-24 w-full mb-6 rounded-lg" /> {/* Información del agente */}

            <div className="flex flex-col w-full h-[500px] space-y-4">
                <Skeleton className="h-8 w-48" /> {/* Título de Zonas Asignadas */}
                <div className="flex flex-col md:flex-row w-full h-full gap-4">
                    <Skeleton className="w-full md:w-1/3 h-40 rounded-lg" /> {/* Lista de zonas */}
                    <Skeleton className="w-full h-full rounded-lg" /> {/* Mapa */}
                </div>
            </div>

            <div className="mt-6 w-full">
                <Skeleton className="h-8 w-48 mb-4" /> {/* Título de Historial de entregas */}
                <Skeleton className="h-40 w-full rounded-lg" /> {/* Lista de entregas */}
            </div>

        </div>
    )
}