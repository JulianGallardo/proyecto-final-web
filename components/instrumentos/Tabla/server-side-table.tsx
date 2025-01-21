import {getInstrumentosPaginated, getTotalPagesInstrumentosPaginated } from "@/actions/instrumentos-actions";
import { TablaInstrumentos } from "./tabla-instrumento";
import PaginationInstruments from "./Pagination";

interface ServerSideTableProps {
  query: string;
  currentPage: number;
}

export default async function ServerSideTable({
  query,
  currentPage,
}: Readonly<ServerSideTableProps>) {

  const instrumentos = await getInstrumentosPaginated(query, currentPage);
  const totalPages = await getTotalPagesInstrumentosPaginated(query);

  return (
    <div className="flex flex-col  bg-white border-gray-200 gap-4">

      <TablaInstrumentos data={instrumentos}  />
      <PaginationInstruments currentPage={1} totalPages={totalPages} query={query} />


    </div>
  );
}

