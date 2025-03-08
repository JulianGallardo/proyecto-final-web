import { getInstrumentTypes, getJuzgados } from "@/actions/instrumentos-actions";
import { getAgenteById, getAgenteByMail } from "@/actions/user-actions";
import {  getZonesByAgent } from "@/actions/zone-actions";
import { auth } from "@/auth"
import NoAutenticado from "@/components/error/errorNoAutenticado"
import ServerSideTableAgent from "@/components/instrumentos-agente/server-side-agente-table";
import FiltrosList from "@/components/instrumentos/Filtros/filtros-list";
import { TableSkeleton } from "@/components/instrumentos/Skeletons/list-skeleton";
import SearchParamsInstrumentos from "@/types/searchParams";
import { Suspense } from "react";



export default async function InsturmentosPage(props: Readonly<{
  searchParams?: Promise<SearchParamsInstrumentos>

}>) {
  const session = await auth()
  const searchParams = await props.searchParams;

  if (!session?.user?.email) {
    return <div><NoAutenticado /></div>
  }


  const agente = await getAgenteByMail(session.user.email);

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
        <ServerSideTableAgent searchParams={searchParams || {}} currentPage={1} agente={agente} />
      </Suspense>


    </div>

  )
}