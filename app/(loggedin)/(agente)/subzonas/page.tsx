import { auth } from "@/auth"
import NoAutenticado from "@/components/error/errorNoAutenticado"
import SubzonasMap from "@/components/subzonas/subzonas"

export default async function SubZonas() {
  const session = await auth()

  if (!session) {
    return <div><NoAutenticado/></div>
  }

  return (
    <div className="flex h-full w-full  ">
      <SubzonasMap />
    </div>

  )
}