
import Overview from "../../overview";
import InstrumentosPorEstado from "../../estadisticasEntregas";
import { getAgentes } from "@/actions/agente-actions";
import SelectAgente from "./selectAgente";


interface TabGeneralProps {
    totalInstrumentos: {
        total: number;
        growthPercentage: number;
    }
    totalInstrumentosActivos: {
        totalActivos: number;
        growthPercentage: number;
    }
    totalAgentes: {
        total: number;
        growth: number;
    }
    totalZonas: number
    data: { month: string; year: number; count: number }[]
    instrumentos: { [estado: string]: number }
}


export default async function TabAgente({ totalInstrumentos, totalInstrumentosActivos, totalAgentes, totalZonas, data, instrumentos }: Readonly<TabGeneralProps>) {

    const agentes = await getAgentes();


    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SelectAgente agentes={agentes} />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Overview data={data} />
                <InstrumentosPorEstado instrumentos={instrumentos} />

            </div>
        </div>
    );
}