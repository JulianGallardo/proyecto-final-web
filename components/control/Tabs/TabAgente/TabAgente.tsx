
import Overview from "../../overview";
import InstrumentosPorEstado from "../../estadisticasEntregas";
import { getAgentes } from "@/actions/agente-actions";
import SelectAgente from "./selectAgente";
import TotalInstrumentos from "../TabGeneral/TotalInstrumentos";
import TotalInsturmentosActivos from "../TabGeneral/TotalInstrumentosActivos";


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


export default async function TabAgente({ totalInstrumentos, totalInstrumentosActivos, data, instrumentos }: Readonly<TabGeneralProps>) {
    const agentes = await getAgentes();
    return (
        <div className="space-y-4">
            <SelectAgente agentes={agentes} />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <TotalInstrumentos totalInstrumentos={totalInstrumentos.total} growth={totalInstrumentos.growthPercentage} />
                <TotalInsturmentosActivos totalInstrumentos={totalInstrumentosActivos.totalActivos} growth={totalInstrumentosActivos.growthPercentage} />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Overview data={data} />
                <InstrumentosPorEstado instrumentos={instrumentos} />

            </div>
        </div>
    );
}