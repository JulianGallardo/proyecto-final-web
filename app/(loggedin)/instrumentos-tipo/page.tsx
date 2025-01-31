import { getTypesPaginated, getTypeTotalPages } from "@/actions/instrumentos-actions";
import TypeList from "@/components/instrumentos-tipo/type-list";
import PaginationInstruments from "@/components/instrumentos/Tabla/Pagination";

interface SearchParamsJuzgados {
    query: string
    page: number
}

export default async function TypePages(props: Readonly<{
  searchParams?: Promise<SearchParamsJuzgados>
}>) {
    const searchParams = await props.searchParams;
    const tipos = await getTypesPaginated(searchParams?.page ?? 1, searchParams?.query ?? "");
    const totalPages = await getTypeTotalPages(searchParams?.query ?? "");


    return (
        <div className="container mx-auto p-4 ">
            <h1 className="text-3xl font-bold mb-6">Tipo de Instrumentos Disponibles</h1>
            <TypeList tipos={tipos}/>
            <PaginationInstruments totalPages={totalPages} />
        </div>
    )
}

