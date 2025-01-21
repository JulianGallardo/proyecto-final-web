import {getInstrumentosPaginated, getTotalPagesInstrumentosPaginated } from "@/actions/instrumentos-actions";
import PaginationInstruments from "./Pagination";
import { CrudInstrumentos } from "../crud-instrumento";
import { Juzgado, InstrumentoType } from "@prisma/client";

interface ServerSideTableProps {
  query: string;
  currentPage: number;
  Juzgados: Juzgado[];
  instrumentosType: InstrumentoType[];
}

export default async function ServerSideTable({
  query,
  currentPage,
  Juzgados,
  instrumentosType
}: Readonly<ServerSideTableProps>) {

  const instrumentos = await getInstrumentosPaginated(query, currentPage);
  const totalPages = await getTotalPagesInstrumentosPaginated(query);

  return (
    <div className="flex flex-col  bg-white border-gray-200 gap-4">

      
      <CrudInstrumentos instrumentos={instrumentos} currentPage={currentPage} totalPages={totalPages} Juzgados={Juzgados} instrumentoTypes={instrumentosType} />
      <PaginationInstruments currentPage={1} totalPages={totalPages} query={query} />


    </div>
  );
}

