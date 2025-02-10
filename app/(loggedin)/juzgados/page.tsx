import { getJuzgadosPaginated, getJuzgadosTotalPages } from "@/actions/instrumentos-actions";
import PaginationInstruments from "@/components/instrumentos/Tabla/Pagination";
import JuzgadosList from "@/components/juzgados/juzgados-list"
import ListCardSkeleton from "@/components/shared/listCardSkeleton";
import { Suspense } from "react";

interface SearchParamsJuzgados {
    query: string
    page: number
}

export default async function JuzgadosPage(props: Readonly<{
    searchParams?: Promise<SearchParamsJuzgados>
}>) {
    const searchParams = await props.searchParams;
    const juzgados = await getJuzgadosPaginated(searchParams?.page ?? 1, searchParams?.query ?? "");
    const totalPages = await getJuzgadosTotalPages(searchParams?.query ?? "");


    return (
        <div className="container mx-auto p-4 ">
            <h1 className="text-3xl font-bold mb-6">Juzgados Disponibles</h1>

            <Suspense fallback={<ListCardSkeleton />}>
                <JuzgadosList juzgados={juzgados} />
            </Suspense>
            <PaginationInstruments totalPages={totalPages} />
        </div>
    )
}

