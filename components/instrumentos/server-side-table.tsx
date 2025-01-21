import { getInstrumentosPaginated } from "@/actions/instrumentos-actions";
import { CrudInstrumentos } from "./crud-instrumento";
import { InstrumentoType, Juzgado } from "@prisma/client";

interface ServerSideTableProps {
  query: string;
  currentPage: number;
  Juzgados: Juzgado[];
  instrumentTypes: InstrumentoType[];
}

export default async function ServerSideTable({
  query,
  currentPage,
  Juzgados,
  instrumentTypes,
}: Readonly<ServerSideTableProps>) {

  const { instrumentos, totalPages } = await getInstrumentosPaginated(
    query,
    currentPage
  );


  return (
    <div className="flex flex-col  bg-white border-gray-200 gap-4">
      <CrudInstrumentos
        instrumentos={instrumentos}
        currentPage={currentPage}
        totalPages={totalPages}
        Juzgados={Juzgados}
        instrumentoTypes={instrumentTypes}
      />


    </div>
  );
}

