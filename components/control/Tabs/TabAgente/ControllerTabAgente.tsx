
import { Suspense } from "react";
import TabGeneralSkeleton from "../TabSkeleton";
import TabAgente from "./TabAgente";
import { AgenteExtendidoDto } from "@/types/agenteTypes";
import SelectAgente from "./selectAgente";


interface TabGeneralProps {
    searchParams?: {
        agenteId?: string;
        zoneName?: string;
    },
    agentes: AgenteExtendidoDto[];
}


export default function ControllerTabAgente({ searchParams, agentes }: Readonly<TabGeneralProps>) {
    return (
        <div className="space-y-4">
            <SelectAgente agentes={agentes} />
            {
                !searchParams?.agenteId && <div className="text-red-500 text-sm">Seleccione un agente para ver los detalles</div>
            }
            {
                searchParams?.agenteId && 
                <Suspense fallback={<TabGeneralSkeleton />}>
                    <TabAgente searchParams={searchParams}  />
                </Suspense>
            }

        </div>
    );
}