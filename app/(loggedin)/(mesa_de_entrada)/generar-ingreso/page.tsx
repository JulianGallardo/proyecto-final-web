import { getAgentes } from "@/actions/user-actions"
import GenerarReporte from "@/components/generar-ingreso/generarReporte";





export default async function Page() {

    const agentes = await getAgentes();



    return (
        <div className="p-4">
           <GenerarReporte agentes={agentes}/>
        </div>
    )
}
