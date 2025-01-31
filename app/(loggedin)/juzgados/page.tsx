import {  getJuzgadosPaginated, getTotalPages } from "@/actions/instrumentos-actions";
import PaginationInstruments from "@/components/instrumentos/Tabla/Pagination";
import JuzgadosList from "@/components/juzgados/juzgados-list"
import SearchInput from "@/components/juzgados/search/search";

interface SearchParamsJuzgados {
    query: string
    page: number
}

export default async function JuzgadosPage(props: Readonly<{
  searchParams?: Promise<SearchParamsJuzgados>
}>) {
    const searchParams = await props.searchParams;
    const juzgados = await getJuzgadosPaginated(searchParams?.page ?? 1, searchParams?.query ?? "");
    const totalPages = await getTotalPages(searchParams?.query ?? "");


    return (
        <div className="container mx-auto p-4 ">
            <h1 className="text-3xl font-bold mb-6">Juzgados Disponibles</h1>
            <JuzgadosList juzgados={juzgados}/>
            <PaginationInstruments totalPages={totalPages} />
        </div>
    )
}

