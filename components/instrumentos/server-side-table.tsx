import { getInstrumentosPaginated } from "@/actions/instrumentos-actions";
import { CrudInstrumentos } from "./crud-instrumento";
import { InstrumentoType, Juzgado } from "@prisma/client";
import FiltrosList from "./filtros-list";

interface ServerSideTableProps {
  query: string;
  currentPage: number;
  Juzgados: Juzgado[];
  instrumentoTypes: InstrumentoType[];
}

export default async function ServerSideTable({
  query,
  currentPage,
  Juzgados,
  instrumentoTypes,
}: Readonly<ServerSideTableProps>) {

  const { instrumentos, totalPages } = await getInstrumentosPaginated(
    query,
    currentPage
  );


  return (
    <div className="flex flex-col  bg-white border-gray-200 gap-4">
      <FiltrosList Juzgados={Juzgados} InstrumentTypes={instrumentoTypes} />
      <CrudInstrumentos
        instrumentos={instrumentos}
        currentPage={currentPage}
        totalPages={totalPages}
        Juzgados={Juzgados}
        instrumentoTypes={instrumentoTypes}
      />


    </div>
  );
}

