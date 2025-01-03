import { auth } from "@/auth"
import Areas from "@/components/areas/maps/map"
import NoAutenticado from "@/components/error/errorNoAutenticado"

export default async function HomePage() {
  const session = await auth()

  if (!session) {
    return <div><NoAutenticado/></div>
  }

  return (
    <div className="flex h-full w-full  ">
      <Areas />
    </div>

  )
}