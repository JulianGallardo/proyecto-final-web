import {getInstrumentosPaginated, getTotalPagesInstrumentosPaginated } from "@/actions/instrumentos-actions";
import PaginationInstruments from "./Pagination";
import { CrudInstrumentos } from "../crud-instrumento";
import { Juzgado, InstrumentoType } from "@prisma/client";
import SearchParamsInstrumentos from "@/types/searchParams";

interface ServerSideTableProps {
  searchParams: SearchParamsInstrumentos;
  currentPage: number;
  Juzgados: Juzgado[];
  instrumentosType: InstrumentoType[];
}

export default async function ServerSideTable({
  searchParams,
  currentPage,
  Juzgados,
  instrumentosType
}: Readonly<ServerSideTableProps>) {


  const instrumentos = await getInstrumentosPaginated(searchParams, currentPage);
  const totalPages = await getTotalPagesInstrumentosPaginated(searchParams);

  return (
    <div className="flex flex-col  bg-white border-gray-200 gap-4">

      <CrudInstrumentos instrumentos={instrumentos} Juzgados={Juzgados} instrumentoTypes={instrumentosType} />
      <PaginationInstruments totalPages={totalPages} />


    </div>
  );
}

