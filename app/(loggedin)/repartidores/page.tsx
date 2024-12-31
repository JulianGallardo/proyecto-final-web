import { auth } from "@/auth"
import BtnLogout from "@/components/auth/btn-logout"
 
export default async function HomePage() {
  const session = await auth()
 
  if (!session) {
    return <div>Not authenticated</div>
  }
 
  return (
    <div className="container w-full ">

      <pre>{JSON.stringify(session, null, 2)}</pre>
      <BtnLogout/>
    </div>

  )
}