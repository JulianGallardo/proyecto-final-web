
import Overview from "../../overview";
import InstrumentosPorEstado from "../../estadisticasEntregas";
import TotalInstrumentos from "./TotalInstrumentos";
import TotalInsturmentosActivos from "./TotalInstrumentosActivos";
import TotalAgentes from "./TotalAgentes";
import TotalZonas from "./TotalZonas";
import { getTotalInstrumentos, getInstrumentosActivos, getAgentGrowht, getTotalZones, getInstrumentosEntregadosUltimosSeisMeses, getInstrumentosPorEstado } from "@/actions/estadisticas-actions";


interface TabGeneralProps {
    searchParams?: {
        agenteId?: string;
        zoneName?: string;
    }
}


export default async function TabGeneral({ searchParams }: Readonly<TabGeneralProps>) {

    let zoneName = searchParams?.zoneName;
    const agenteIdString = searchParams?.agenteId;

    let agenteId: number | undefined;
    if (agenteIdString) {
        agenteId = parseInt(agenteIdString);
    }

    if (zoneName) {
        zoneName = zoneName.replace(/\+/g, " ");
    }

    const totalInstrumentosPromise = getTotalInstrumentos(zoneName, agenteId);

    const totalInstrumentosActivosPromise = getInstrumentosActivos(zoneName, agenteId);

    const totalAgentesPromise = getAgentGrowht();

    const totalZonasPromise = getTotalZones();

    const dataPromise = getInstrumentosEntregadosUltimosSeisMeses(zoneName, agenteId);

    const instrumentosPromse = getInstrumentosPorEstado(zoneName, agenteId);

    const [totalInstrumentos, totalInstrumentosActivos, totalAgentes, totalZonas, data, instrumentos] = await Promise.all([totalInstrumentosPromise, totalInstrumentosActivosPromise, totalAgentesPromise, totalZonasPromise, dataPromise, instrumentosPromse]);



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