import { getInstrumentosPaginatedByAgent, getTotalPagesInstrumentosPaginatedByAgent } from "@/actions/instrumentos-actions";
import PaginationInstruments from "../shared/Pagination";
import SearchParamsInstrumentos from "@/types/searchParams";
import { TablaInstrumentosAgente } from "./tabla-instrumentos-agente";

interface ServerSideTableProps {
  searchParams: SearchParamsInstrumentos;
  currentPage: number;
  agente: {
    id: number;
  };
}

export default async function ServerSideTableAgent({
  searchParams,
  currentPage,
  agente
}: Readonly<ServerSideTableProps>) {

  const instrumentos = await getInstrumentosPaginatedByAgent(searchParams, currentPage, agente.id);
  const totalPages = await getTotalPagesInstrumentosPaginatedByAgent(searchParams, agente.id);

  return (
    <div className="flex flex-col bg-white border-gray-200 gap-4">

      <TablaInstrumentosAgente data={instrumentos} />
      <PaginationInstruments totalPages={totalPages} />
    </div>
  );
}

