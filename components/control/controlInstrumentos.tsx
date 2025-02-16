import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TabGeneral from "./Tabs/TabGeneral/TabGeneral"
import { getAgentGrowht, getInstrumentosActivos, getInstrumentosEntregadosUltimosSeisMeses, getInstrumentosPorEstado, getTotalInstrumentos, getTotalZones } from "@/actions/estadisticas-actions";
import TabAgente from "./Tabs/TabAgente/TabAgente";
import TabZonas from "./Tabs/TabZona/TabZona";


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

  if(zoneName){
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
        <Tabs defaultValue="overview" >
          <TabsList>
            <TabsTrigger value="overview">Vista General</TabsTrigger>
            <TabsTrigger value="agentes">Por Agente</TabsTrigger>
            <TabsTrigger value="zonas">Por Zona</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <TabGeneral totalInstrumentos={totalInstrumentos} totalInstrumentosActivos={totalInstrumentosActivos} totalAgentes={totalAgentes} totalZonas={totalZonas} data={data} instrumentos={instrumentos} />
          </TabsContent>
          <TabsContent value="agentes" className="space-y-4">
            <TabAgente totalInstrumentos={totalInstrumentos} totalInstrumentosActivos={totalInstrumentosActivos} totalAgentes={totalAgentes} totalZonas={totalZonas} data={data} instrumentos={instrumentos} />
          </TabsContent>
          <TabsContent value="zonas" className="space-y-4">
            <TabZonas totalInstrumentos={totalInstrumentos} totalInstrumentosActivos={totalInstrumentosActivos} totalAgentes={totalAgentes} totalZonas={totalZonas} data={data} instrumentos={instrumentos} />
          </TabsContent>  
        </Tabs>
      </div>
    </div>
  )
}

