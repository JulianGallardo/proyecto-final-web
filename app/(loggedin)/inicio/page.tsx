import { auth } from "@/auth"
import Menu from "@/components/inicio/menu"
 
export default async function HomePage() {
  const session = await auth()
 
  if (!session) {
    return <div>Not authenticated</div>
  }
 
  return (
    <div className=" w-full h-full ">
      <Menu/>
    </div>

  )
}