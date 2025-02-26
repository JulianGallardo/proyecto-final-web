import { getAllUsersByRole, getTotalPagesByRole } from "@/actions/user-actions"
import { auth } from "@/auth"
import NoAutenticado from "@/components/error/errorNoAutenticado"
import ListaMesaEntrada from "@/components/mesa-de-entrada/list-mesa-entrada"
import { Role } from "@prisma/client"

interface SearchParamsAgentes {
    query: string
    currentPage: number
}

export default async function AgentesPage(props: Readonly<{
    searchParams?: Promise<SearchParamsAgentes>
}>) {
    const searchParams = await props.searchParams;
    const session = await auth()
    const personal = await getAllUsersByRole(Role.mesa_de_entrada, searchParams?.currentPage ?? 1, searchParams?.query )
    const totalPages = await getTotalPagesByRole(Role.mesa_de_entrada)

    if (!session) {
        return <div><NoAutenticado /></div>
    }

    return (
        <div className="flex flex-col gap-4 p-4 ">
            <h2 className="text-2xl font-bold">Lista de Personal de Mesa de Entrada</h2>
            <ListaMesaEntrada personal={personal} totalPages={totalPages} />




        </div>

    )
}