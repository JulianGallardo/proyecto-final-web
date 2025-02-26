
import { getAllZones } from "@/actions/zone-actions";
import ControlTabs from "./Tabs/Tabs";
import { getAgentes } from "@/actions/user-actions";

interface DashboardControlProps {
  searchParams?: {
    agenteId?: string;
    zoneName?: string;
  }
}


export default  async function DashboardControl({ searchParams }: Readonly<DashboardControlProps>) {

  const zonas = await getAllZones();
  const agentes = await getAgentes();
  const zoneNames = zonas.map(zone => zone.properties.name);

  return (
    <div className="flex flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Control de Instrumentos</h2>
        </div>
        <ControlTabs searchParams={searchParams} zonas={zoneNames} agentes={agentes}/>

      </div>
    </div>
  )
}

