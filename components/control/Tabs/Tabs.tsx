import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabGeneral from "./TabGeneral/TabGeneral";
import TabAgente from "./TabAgente/TabAgente";
import TabZonas from "./TabZona/TabZona";

interface ControlTabsProps {
  searchParams?: {
    agenteId?: string;
    zoneName?: string;
  }
}

export default function ControlTabs({ searchParams }: Readonly<ControlTabsProps>) {

  return (
    <Tabs defaultValue="overview" >
      <TabsList>
        <TabsTrigger value="overview">Vista General</TabsTrigger>
        <TabsTrigger value="agentes">Por Agente</TabsTrigger>
        <TabsTrigger value="zonas">Por Zona</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <TabGeneral searchParams={searchParams}
        />
      </TabsContent>
      <TabsContent value="agentes" className="space-y-4">
        <TabAgente
          searchParams={searchParams}
        />
      </TabsContent>
      <TabsContent value="zonas" className="space-y-4">
        <TabZonas
          searchParams={searchParams}
        />
      </TabsContent>
    </Tabs>
  );
}
