import { Suspense } from "react";
import { CrudInstrumentos } from "./crud-instrumento";
import ServerSideTable, { TableSkeleton } from "./server-side-table";
import { getInstrumentosPaginated, getInstrumentTypes, getJuzgados } from "@/actions/instrumentos-actions";




export default async function InstrumentosPages(props: Readonly<{
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>;
}>) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    const instrumentTypes = await getInstrumentTypes();
    const juzgados = await getJuzgados();
    const { instrumentos, totalPages } = await getInstrumentosPaginated(
        query,
        currentPage
    );

    return (
        <div className="w-full h-full">
            <CrudInstrumentos
                Juzgados={juzgados}
                instrumentoTypes={instrumentTypes}
                instrumentos={instrumentos}                
            />

            <Suspense fallback={<TableSkeleton />}>
                <ServerSideTable
                    currentPage={currentPage}
                    query={query}
                />
            </Suspense>
        </div>
    )
} 