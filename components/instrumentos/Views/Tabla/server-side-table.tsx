import {getInstrumentosPaginated, getTotalPagesInstrumentosPaginated } from "@/actions/instrumentos-actions";
import PaginationInstruments from "./Pagination";
import { CrudInstrumentos } from "../../crud-instrumento";
import { Juzgado, InstrumentoType } from "@prisma/client";
import SearchParamsInstrumentos from "@/types/searchParams";
import { ExtendedZone } from "@/types/ZoneTypes";

interface ServerSideTableProps {
  searchParams: SearchParamsInstrumentos;
  currentPage: number;
  Juzgados: Juzgado[];
  instrumentosType: InstrumentoType[];
  zonas: ExtendedZone[];
}

export default async function ServerSideTable({
  searchParams,
  currentPage,
  Juzgados,
  instrumentosType,
  zonas,
}: Readonly<ServerSideTableProps>) {


  const instrumentos = await getInstrumentosPaginated(searchParams, currentPage);
  const totalPages = await getTotalPagesInstrumentosPaginated(searchParams);

  return (
    <div className="flex flex-col  bg-white border-gray-200 gap-4">
      
      <CrudInstrumentos instrumentos={instrumentos} Juzgados={Juzgados} instrumentoTypes={instrumentosType} zonas={zonas} />
      <PaginationInstruments totalPages={totalPages} />


    </div>
  );
}

