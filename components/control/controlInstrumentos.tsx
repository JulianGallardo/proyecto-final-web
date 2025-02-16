
import { getAgentGrowht, getInstrumentosActivos, getInstrumentosEntregadosUltimosSeisMeses, getInstrumentosPorEstado, getTotalInstrumentos, getTotalZones } from "@/actions/estadisticas-actions";
import ControlTabs from "./Tabs/Tabs";


interface DashboardControlProps {
  searchParams?: {
    agenteId?: string;
    zoneName?: string;
  }
}


export default async function DashboardControl({ searchParams }: Readonly<DashboardControlProps>) {

  let zoneName = searchParams?.zoneName;
  const agenteIdString = searchParams?.agenteId;

  let agenteId: number | undefined;
  if (agenteIdString) {
    agenteId = parseInt(agenteIdString);
  }

  if (zoneName) {
    zoneName = zoneName.replace(/\+/g, " ");
  }

  const totalInstrumentos = await getTotalInstrumentos(zoneName, agenteId);

  const totalInstrumentosActivos = await getInstrumentosActivos(zoneName, agenteId);

  const totalAgentes = await getAgentGrowht();

  const totalZonas = await getTotalZones();

  const data = await getInstrumentosEntregadosUltimosSeisMeses(zoneName, agenteId);

  const instrumentos = await getInstrumentosPorEstado(zoneName, agenteId);


  return (
    <div className="flex flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Control de Instrumentos</h2>
        </div>
        <ControlTabs totalInstrumentos={totalInstrumentos} totalInstrumentosActivos={totalInstrumentosActivos} totalAgentes={totalAgentes} totalZonas={totalZonas} data={data} instrumentos={instrumentos} />
      </div>
    </div>
  )
}

