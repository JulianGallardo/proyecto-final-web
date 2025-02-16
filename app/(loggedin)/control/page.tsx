import { auth } from "@/auth"
import DashboardControl from "@/components/control/controlInstrumentos"
import NoAutenticado from "@/components/error/errorNoAutenticado"

export default async function HomePage() {
  const session = await auth()

  if (!session) {
    return <div><NoAutenticado /></div>
  }

  return (
    <div className="w-full h-full">
      <DashboardControl />
    </div>

  )
}