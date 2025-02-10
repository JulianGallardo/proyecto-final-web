import { auth } from "@/auth"
import NoAutenticado from "@/components/error/errorNoAutenticado"
import Menu from "@/components/inicio/menu"

 
export default async function HomePage() {
  const session = await auth()

 
  if (!session) {
    return <div>
      <NoAutenticado/>
    </div>
  }
 
  return (
    <div className=" w-full h-full ">
      <Menu/>
    </div>

  )
}