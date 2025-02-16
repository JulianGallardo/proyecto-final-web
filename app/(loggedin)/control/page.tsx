import { auth } from "@/auth"
import DashboardControl from "@/components/control/controlInstrumentos"
import NoAutenticado from "@/components/error/errorNoAutenticado"


interface SearchParamsControl {
  agenteId?: string;
  zoneName?: string;
}



export default async function ControlPage(props: Readonly<{
  searchParams?: Promise<SearchParamsControl>
}>) {

  const searchParams = await props.searchParams;
  const session = await auth()

  if (!session) {
    return <div><NoAutenticado /></div>
  }

  return (
    <div className="w-full h-full">
      <DashboardControl searchParams={searchParams} />
    </div>

  )
}