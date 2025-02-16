
import ControlTabs from "./Tabs/Tabs";

interface DashboardControlProps {
  searchParams?: {
    agenteId?: string;
    zoneName?: string;
  }
}


export default  function DashboardControl({ searchParams }: Readonly<DashboardControlProps>) {

 

  return (
    <div className="flex flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Control de Instrumentos</h2>
        </div>
        <ControlTabs searchParams={searchParams}/>

      </div>
    </div>
  )
}

