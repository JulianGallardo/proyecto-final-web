

import { getTotalInstrumentos, getInstrumentosActivos, getInstrumentosEntregadosUltimosSeisMeses, getInstrumentosPorEstado } from "@/actions/estadisticas-actions";

import TotalInstrumentos from "./Tabs/TabGeneral/TotalInstrumentos";
import TotalInsturmentosActivos from "./Tabs/TabGeneral/TotalInstrumentosActivos";
import Overview from "./overview";
import InstrumentosPorEstado from "./estadisticasEntregas";


interface TabGeneralProps {
    agenteId: number;
}


export default async function ControlAgente({ agenteId  }: Readonly<TabGeneralProps>) {



    const zoneName = undefined

    const totalInstrumentosPromise = getTotalInstrumentos(zoneName, agenteId);

    const totalInstrumentosActivosPromise = getInstrumentosActivos(zoneName, agenteId);

    const dataPromise = getInstrumentosEntregadosUltimosSeisMeses(zoneName, agenteId);

    const instrumentosPromse = getInstrumentosPorEstado(zoneName, agenteId);

    const [totalInstrumentos, totalInstrumentosActivos, data, instrumentos] = await Promise.all([totalInstrumentosPromise, totalInstrumentosActivosPromise, dataPromise, instrumentosPromse]);



    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Control de Instrumentos y estadísticas</h2>
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