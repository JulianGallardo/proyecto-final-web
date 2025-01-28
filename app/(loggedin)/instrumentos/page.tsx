import { getInstrumentTypes, getJuzgados } from "@/actions/instrumentos-actions";
import { auth } from "@/auth"
import NoAutenticado from "@/components/error/errorNoAutenticado"
import FiltrosList from "@/components/instrumentos/Filtros/filtros-list";
import { TableSkeleton } from "@/components/instrumentos/Skeletons/list-skeleton";
import ServerSideTable from "@/components/instrumentos/Tabla/server-side-table";
import SearchParamsInstrumentos from "@/types/searchParams";
import { Suspense } from "react";



export default async function InsturmentosPage(props: Readonly<{
  searchParams?: Promise<SearchParamsInstrumentos>
  
}>) {
  const session = await auth()
  const searchParams = await props.searchParams;

  if (!session) {
    return <div><NoAutenticado /></div>
  }
  


  const instrumentTypesData = await getInstrumentTypes();
  const juzgadosData = await getJuzgados();
  const [instrumentTypes, juzgados] = await Promise.all([instrumentTypesData, juzgadosData]);


  return (
    <div className="flex flex-col gap-4 p-4 ">
      <h2 className="text-2xl font-bold">Lista de Instrumentos</h2>
      <FiltrosList Juzgados={juzgados} InstrumentTypes={instrumentTypes} />
      <Suspense fallback={<TableSkeleton />}>
        <ServerSideTable
          Juzgados={juzgados}
          instrumentosType={instrumentTypes}
          currentPage={Number(searchParams?.page) || 1}
          searchParams={searchParams || {} as SearchParamsInstrumentos}
        />
      </Suspense>


    </div>

  )
}