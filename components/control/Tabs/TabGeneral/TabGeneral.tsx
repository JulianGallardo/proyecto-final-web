
import  Overview  from "../../overview";
import InstrumentosPorEstado from "../../estadisticasEntregas";
import TotalInstrumentos from "./TotalInstrumentos";
import TotalInsturmentosActivos from "./TotalInstrumentosActivos";
import TotalAgentes from "./TotalAgentes";
import TotalZonas from "./TotalZonas";


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


export default function TabGeneral({ totalInstrumentos, totalInstrumentosActivos, totalAgentes, totalZonas, data, instrumentos }: Readonly<TabGeneralProps>) {
    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <TotalInstrumentos totalInstrumentos={totalInstrumentos.total} growth={totalInstrumentos.growthPercentage} />
                <TotalInsturmentosActivos totalInstrumentos={totalInstrumentosActivos.totalActivos} growth={totalInstrumentosActivos.growthPercentage} />
                <TotalAgentes totalAgentes={totalAgentes.total} growth={totalAgentes.growth} />
                <TotalZonas totalZonas={totalZonas} />

            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Overview data={data} />
                <InstrumentosPorEstado instrumentos={instrumentos} />

            </div>
        </div>
    );
}