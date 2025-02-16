import { getAgenteByMail } from "@/actions/agente-actions"
import { auth } from "@/auth"
import EntregasServerSide from "@/components/entregas/entregasServerSide"
import NoAutenticado from "@/components/error/errorNoAutenticado"

interface SearchParamsAgentes {
    page?: string;
    date?: string;
}

export default async function EntregasPage(props: Readonly<{
    searchParams?: Promise<SearchParamsAgentes>
}>) {
    const searchParams = await props.searchParams;
    const session = await auth()


    if (!session) {
        return <div><NoAutenticado /></div>
    }
    const email = session.user.email;
    if (!email) {
        throw new Error("User email is undefined");
    }
    const agente = await getAgenteByMail(email);

    return (
        <div className="flex flex-col gap-4 p-4 ">
            <h2 className="text-2xl font-bold">Lista de Entregas</h2>
            {searchParams && <EntregasServerSide searchParams={searchParams} agenteId={agente.id} user={session} />}
            
        </div>

    )
}