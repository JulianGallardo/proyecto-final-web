
import Overview from "../../overview";
import InstrumentosPorEstado from "../../estadisticasEntregas";
import { getAgentes } from "@/actions/agente-actions";
import SelectAgente from "./selectAgente";
import TotalInstrumentos from "../TabGeneral/TotalInstrumentos";
import TotalInsturmentosActivos from "../TabGeneral/TotalInstrumentosActivos";
import { getTotalInstrumentos, getInstrumentosActivos, getInstrumentosEntregadosUltimosSeisMeses, getInstrumentosPorEstado } from "@/actions/estadisticas-actions";


interface TabGeneralProps {
    searchParams?: {
        agenteId?: string;
        zoneName?: string;
    }
}


export default async function TabAgente({ searchParams }: Readonly<TabGeneralProps>) {
    


    let zoneName = searchParams?.zoneName;
    const agenteIdString = searchParams?.agenteId;

    let agenteId: number | undefined;
    if (agenteIdString) {
        agenteId = parseInt(agenteIdString);
    }

    if (zoneName) {
        zoneName = zoneName.replace(/\+/g, " ");
    }
    const agentesPromise =  getAgentes();
    
    const totalInstrumentosPromise = getTotalInstrumentos(zoneName, agenteId);

    const totalInstrumentosActivosPromise = getInstrumentosActivos(zoneName, agenteId);



    const dataPromise = getInstrumentosEntregadosUltimosSeisMeses(zoneName, agenteId);

    const instrumentosPromse = getInstrumentosPorEstado(zoneName, agenteId);

    const [totalInstrumentos, totalInstrumentosActivos, data, instrumentos,agentes] = await Promise.all([totalInstrumentosPromise, totalInstrumentosActivosPromise, dataPromise, instrumentosPromse,agentesPromise]);




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