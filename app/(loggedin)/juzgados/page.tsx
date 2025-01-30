import { getJuzgados } from "@/actions/instrumentos-actions";
import JuzgadosList from "@/components/juzgados/juzgados-list"

export default async function JuzgadosPage() {

    const juzgados = await getJuzgados();


    return (
        <div className="container mx-auto p-4 ">
            <h1 className="text-3xl font-bold mb-6">Juzgados Disponibles</h1>

            <JuzgadosList juzgados={juzgados}/>
        </div>
    )
}

