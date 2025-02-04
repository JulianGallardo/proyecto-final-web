import { getAgentes, getAgentesPaginated, getTotalPages } from "@/actions/agente-actions"
import { auth } from "@/auth"
import ListAgentes from "@/components/agentes/list-agentes"
import NoAutenticado from "@/components/error/errorNoAutenticado"


export default async function AgentesPage() {




  const session = await auth()




  if (!session) {
    return <div><NoAutenticado /></div>
  }

  return (
    <div className="flex flex-col gap-4 p-4 ">
      <h2 className="text-2xl font-bold">Aca iria ver agentes</h2>
      



    </div>

  )
}