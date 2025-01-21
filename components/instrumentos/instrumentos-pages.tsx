import { Suspense } from "react";
import ServerSideTable, { TableSkeleton } from "./server-side-table";
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

    const instrumentTypes = await getInstrumentTypes();
    const juzgados = await getJuzgados();

    return (
        <div className="w-full h-full">
            <Suspense fallback={<TableSkeleton />}>
                <ServerSideTable
                    Juzgados={juzgados}
                    instrumentTypes={instrumentTypes}
                    currentPage={currentPage}
                    query={query}
                />
            </Suspense>
        </div>
    )
} 