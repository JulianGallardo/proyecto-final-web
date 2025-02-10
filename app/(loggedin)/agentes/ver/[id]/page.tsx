import { getAllZones } from "@/actions/zone-actions"
import { auth } from "@/auth"
import AgenteInfo from "@/components/agentes/[id]/agenteInfo"
import NoAutenticado from "@/components/error/errorNoAutenticado"


export default async function AgentesPage() {
  const session = await auth()
  const zonas = await getAllZones()
  if (!session) {
    return <div><NoAutenticado /></div>
  }

  return (
    <div className="p-4 ">
        <AgenteInfo zonasBDD={zonas}/>


    </div>

  )
}