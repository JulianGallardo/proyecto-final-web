import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabGeneral from "./TabGeneral/TabGeneral";
import TabAgente from "./TabAgente/TabAgente";
import TabZonas from "./TabZona/TabZona";

interface ControlTabsProps {
  totalInstrumentos: {
    total: number;
    growthPercentage: number;
  };
  totalInstrumentosActivos: {
    totalActivos: number;
    growthPercentage: number;
  };
  totalAgentes: {
    total: number;
    growth: number;
  };
  totalZonas: number;
  data: { month: string; year: number; count: number }[];
  instrumentos: { [estado: string]: number };
}

export default function ControlTabs({
  totalInstrumentos,
  totalInstrumentosActivos,
  totalAgentes,
  totalZonas,
  data,
  instrumentos,
}: Readonly<ControlTabsProps>) {

  return (
    <Tabs defaultValue="overview" >
      <TabsList>
        <TabsTrigger value="overview">Vista General</TabsTrigger>
        <TabsTrigger value="agentes">Por Agente</TabsTrigger>
        <TabsTrigger value="zonas">Por Zona</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <TabGeneral
          totalInstrumentos={totalInstrumentos}
          totalInstrumentosActivos={totalInstrumentosActivos}
          totalAgentes={totalAgentes}
          totalZonas={totalZonas}
          data={data}
          instrumentos={instrumentos}
        />
      </TabsContent>
      <TabsContent value="agentes" className="space-y-4">
        <TabAgente
          totalInstrumentos={totalInstrumentos}
          totalInstrumentosActivos={totalInstrumentosActivos}
          totalAgentes={totalAgentes}
          totalZonas={totalZonas}
          data={data}
          instrumentos={instrumentos}
        />
      </TabsContent>
      <TabsContent value="zonas" className="space-y-4">
        <TabZonas
          totalInstrumentos={totalInstrumentos}
          totalInstrumentosActivos={totalInstrumentosActivos}
          totalAgentes={totalAgentes}
          totalZonas={totalZonas}
          data={data}
          instrumentos={instrumentos}
        />
      </TabsContent>
    </Tabs>
  );
}
