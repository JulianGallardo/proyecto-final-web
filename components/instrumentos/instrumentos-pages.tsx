import { Suspense } from "react";
import ServerSideTable from "@/components/instrumentos/server-side-table";
import { TableSkeleton } from "./Skeletons/list-skeleton";
import {  getInstrumentTypes, getJuzgados } from "@/actions/instrumentos-actions";




export default async function InstrumentosPages(props: Readonly<{
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>;
}>) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;


    
    const instrumentTypesData = await getInstrumentTypes();
    const juzgadosData = await getJuzgados();
    const [instrumentTypes, juzgados] = await Promise.all([instrumentTypesData, juzgadosData]);

    return (
        <div className="w-full h-full">

            <Suspense fallback={<TableSkeleton />}>
                <ServerSideTable
                    Juzgados={juzgados}
                    instrumentoTypes={instrumentTypes}
                    currentPage={currentPage}
                    query={query}
                />
            </Suspense>
        </div>
    )
} 