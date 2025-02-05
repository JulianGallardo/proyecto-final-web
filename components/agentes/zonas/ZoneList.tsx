import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AgenteExtendidoDto } from "@/types/agenteTypes";
import { ZoneDto } from "@/types/ZoneTypes";
import ManageZones from "../[id]/manageZones";
import { FatCornerUpLeft, Map, SadCircle, UserCircle } from "@mynaui/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ZoneListProps {
  agentes: AgenteExtendidoDto[];
  zones: ZoneDto[];
}

export default function ZoneList({ agentes, zones }: Readonly<ZoneListProps>) {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:justify-between items-center gap-2  mb-6">
        <div className="flex flex-row items-center gap-2 ">
          <h2 className="text-xl font-semibold text-gray-700">Gestionar zonas de reparto</h2>
          <Map className="w-6 h-6 text-gray-600" />
        </div>
        <div>
          <Link href="/agentes">
            <Button className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <span className="mr-2">Volver al listado</span>
              <FatCornerUpLeft  className="w-6 h-6" />
            </Button>
          </Link>

        </div>

      </div>
      <div className="flex flex-col gap-3">
        {
          agentes.length === 0 && (
            <div className="p-4 bg-gray-50 rounded-lg flex flex-col items-center gap-2 h-full w-full ">
              <SadCircle className="w-8 h-8 text-gray-400" />
              <p className="text-lg font-semibold text-gray-400">No hay agentes registrados</p>
            </div>
          )

        }
        {agentes.length > 0 && agentes.map((agente) => (
          <Accordion key={agente.id} type="single" collapsible  >
            <AccordionItem value="agente-zones" >
              <AccordionTrigger className="flex items-center justify-between p-4 hover:bg-gray-50 hover:border-blue-400 transition-colors rounded-lg">

                <div className="flex flex-row items-center gap-2">
                  <span className="text-lg font-semibold text-gray-600">
                    {agente.user.name}
                  </span>
                  <UserCircle  className="w-6 h-6 text-gray-600" />
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 rounded-lg">
                <ManageZones agente={agente} zones={zones} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  );
}