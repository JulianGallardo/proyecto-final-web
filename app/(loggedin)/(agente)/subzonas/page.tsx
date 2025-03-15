import { getAgenteByMail } from "@/actions/user-actions"
import { getZonesByAgent } from "@/actions/zone-actions"
import { auth } from "@/auth"
import NoAutenticado from "@/components/error/errorNoAutenticado"
import SubzonasMap from "@/components/subzonas/subzonas"
import TerraDrawHandlerSubZonas from "@/components/subzonas/terraDrawHandlerSubZonas"

export default async function SubZonas() {
  const session = await auth()


  if (!session) {
    return <div><NoAutenticado/></div>
  }

  if(!session.user.email){
    throw new Error ("No se ha encontrado el email del usuario")
  }

  const agente = await getAgenteByMail(session.user.email)
  const zonasBDD = await getZonesByAgent(agente.id)




  return (
    <div className="flex h-full w-full  ">
      <TerraDrawHandlerSubZonas zonasBDD={zonasBDD} />
    </div>

  )
}