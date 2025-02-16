import { getAgenteByMail } from "@/actions/agente-actions";
import { auth } from "@/auth"
import ControlAgente from "@/components/control/controlAgente";
import NoAutenticado from "@/components/error/errorNoAutenticado"


interface SearchParamsControl {
    agenteId?: string;
    zoneName?: string;
}



export default async function ControlPage(props: Readonly<{
    searchParams?: Promise<SearchParamsControl>
}>) {

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
        <div className="w-full h-full p-4">
            <ControlAgente agenteId={agente.id} />
        </div>

    )
}