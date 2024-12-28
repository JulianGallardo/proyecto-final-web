import { auth } from "@/auth"
import Areas from "@/components/areas/maps/map"

export default async function HomePage() {
  const session = await auth()

  if (!session) {
    return <div>Not authenticated</div>
  }

  return (
    <div className="flex h-full w-full ">
      <Areas />
    </div>

  )
}