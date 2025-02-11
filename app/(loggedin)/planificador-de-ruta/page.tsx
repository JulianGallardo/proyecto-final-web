import { auth } from "@/auth"
import NoAutenticado from "@/components/error/errorNoAutenticado"
import RoutePlanner from "@/components/planificador-de-ruta/planificador"

export default async function PlanificadorPage() {
  const session = await auth()

  if (!session) {
    return <div><NoAutenticado/></div>
  }

  return (
    <div className="flex h-full w-full  ">
      <RoutePlanner />
    </div>
  )
}