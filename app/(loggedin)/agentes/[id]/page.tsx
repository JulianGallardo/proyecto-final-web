
import { auth } from "@/auth"
import AgenteInfo from "@/components/agentes/[id]/agenteInfo"
import NoAutenticado from "@/components/error/errorNoAutenticado"


export default async function AgentesPage() {
  const session = await auth()
  if (!session) {
    return <div><NoAutenticado /></div>
  }

  return (
    <div className="flex flex-col gap-4 p-4 ">
      <AgenteInfo />



    </div>

  )
}