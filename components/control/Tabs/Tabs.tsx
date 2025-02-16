import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabGeneral from "./TabGeneral/TabGeneral";
import TabAgente from "./TabAgente/TabAgente";
import { Suspense } from "react";
import TabSkeleton from "./TabSkeleton";
import ControllerTabZonas from "./TabZona/ControlerTabZona";
import { AgenteExtendidoDto } from "@/types/agenteTypes";

interface ControlTabsProps {
  searchParams?: {
    agenteId?: string;
    zoneName?: string;
  }
  agentes:AgenteExtendidoDto[],
  zonas:string[]
}

export default function ControlTabs({ searchParams,agentes,zonas }: Readonly<ControlTabsProps>) {

  return (
    <Tabs defaultValue="overview" >
      <TabsList>
        <TabsTrigger value="overview">Vista General</TabsTrigger>
        <TabsTrigger value="agentes">Por Agente</TabsTrigger>
        <TabsTrigger value="zonas">Por Zona</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <Suspense fallback={<TabSkeleton />}>
          <TabGeneral searchParams={searchParams}
          />
        </Suspense>
      </TabsContent>
      <TabsContent value="agentes" className="space-y-4">
        <Suspense fallback={<TabSkeleton />}>

          <TabAgente
            searchParams={searchParams}
            agentes={agentes}
          />
        </Suspense>
      </TabsContent>
      <TabsContent value="zonas" className="space-y-4">
          <ControllerTabZonas
            searchParams={searchParams}
            zonas={zonas}
          />
      </TabsContent>
    </Tabs>
  );
}
