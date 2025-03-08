import { getInstrumentTypes, getJuzgados } from "@/actions/instrumentos-actions";
import { getAgenteById } from "@/actions/user-actions";
import { getAllZones, getZonesByAgent } from "@/actions/zone-actions";
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


  const agente = await getAgenteById(Number(session.user.id));

  const instrumentTypesData = getInstrumentTypes();
  const juzgadosData = getJuzgados();
  const zonasData = getZonesByAgent(Number(agente.id));
  const [instrumentTypes, juzgados, zonas] = await Promise.all([instrumentTypesData, juzgadosData, zonasData]);


  return (
    <div className="flex flex-col gap-4 p-4 ">
      <h2 className="text-2xl font-bold">Lista de Instrumentos</h2>
      <FiltrosList Juzgados={juzgados} InstrumentTypes={instrumentTypes} Zonas={zonas.map(
        (zona) => (zona.zoneName)
      )} />
      <Suspense fallback={<TableSkeleton />}>
        Tabla
      </Suspense>


    </div>

  )
}