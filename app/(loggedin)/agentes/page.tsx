import { getAgentes, getAgentesPaginated, getTotalPages } from "@/actions/agente-actions"
import { auth } from "@/auth"
import ListAgentes from "@/components/agentes/list-agentes"
import NoAutenticado from "@/components/error/errorNoAutenticado"

interface SearchParamsAgentes {
  query: string
  currentPage: number
}

export default async function AgentesPage(props: Readonly<{
  searchParams?: Promise<SearchParamsAgentes>
}>) {
  const searchParams = await props.searchParams;
  const session = await auth()
  const agentes = await getAgentesPaginated(searchParams?.currentPage || 1, searchParams?.query || "")
  const totalPages = await getTotalPages(searchParams?.query || "")

  if (!session) {
    return <div><NoAutenticado /></div>
  }

  return (
    <div className="flex flex-col gap-4 p-4 ">
      <h2 className="text-2xl font-bold">Lista de Agentes</h2>
      <ListAgentes agentes={agentes} totalPages={totalPages} />



    </div>

  )
}