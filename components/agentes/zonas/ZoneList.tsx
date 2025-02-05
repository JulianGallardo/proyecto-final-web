import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AgenteExtendidoDto } from "@/types/agenteTypes";
import { map } from "zod";
import ManageZones from "../[id]/manageZones";
import { ZoneDto } from "@/types/ZoneTypes";

interface ZoneListProps {
  agentes: AgenteExtendidoDto[];
  zones: ZoneDto[];
}



export default function ZoneList({ agentes,zones }: Readonly<ZoneListProps>) {

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2">Asignar Zonas</h3>
      <div className="flex flex-col gap-2">
        {
          agentes.map((agente) => (

            <Accordion key={agente.id} type="single" collapsible className="border border-gray-300 rounded-lg shadow-md">
              <AccordionItem value="filtros" className="overflow-hidden">
                <AccordionTrigger
                  className="flex items-center justify-between px-4 py-3 "
                >
                  {agente.user.name}
                </AccordionTrigger>
                <AccordionContent className="px-4 py-3">
                    <ManageZones agente={agente} zones={zones}/>
                    

                </AccordionContent>
              </AccordionItem>
            </Accordion>



          ))

        }
      </div>
    </div>
  )
}

