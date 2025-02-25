import { getAgenteByMail } from "@/actions/user-actions"
import { getInstrumentosAEntregar } from "@/actions/instrumentos-actions"
import { getZonesByAgent } from "@/actions/zone-actions"
import { auth } from "@/auth"
import NoAutenticado from "@/components/error/errorNoAutenticado"
import StepPlanner from "@/components/planificador-de-ruta/stepManager"
import { AgenteExtendidoDto } from "@/types/agenteTypes"

export default async function PlanificadorPage() {
  const session = await auth()


  if (!session) {
    return <div><NoAutenticado /></div>
  }


  const email = session.user.email;
  if (!email) {
    return <div>No paso</div>
  }

  const agente: AgenteExtendidoDto = await getAgenteByMail(email)



  if (!agente?.zonas) {
    return <div>Error</div>
  }



  const zonas = await getZonesByAgent(agente.id)
  const instrumentos = await getInstrumentosAEntregar(agente.zonas.map(zona => zona.zoneName))

  return (
    <div className="flex h-full w-full  ">
      <StepPlanner instrumentos={instrumentos} agente={agente} zonas={zonas} />
    </div>
  )
}