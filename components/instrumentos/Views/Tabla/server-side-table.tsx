import { Suspense } from "react";
import { Juzgado, InstrumentoType } from "@prisma/client";
import SearchParamsInstrumentos from "@/types/searchParams";
import { ExtendedZone } from "@/types/ZoneTypes";
import InstrumentsDataLoader from "./instruments-data-loader";
import { TableSkeleton } from "../../Skeletons/list-skeleton";

interface ServerSideTableProps {
  searchParams: SearchParamsInstrumentos;
  currentPage: number;
  Juzgados: Juzgado[];
  instrumentosType: InstrumentoType[];
  zonas: ExtendedZone[];
}

export default function ServerSideTable({
  searchParams,
  currentPage,
  Juzgados,
  instrumentosType,
  zonas,
}: Readonly<ServerSideTableProps>) {
  // Crear una cadena única basada en los searchParams para usar como key
  const searchParamsKey = JSON.stringify(searchParams);

  return (
    <div className="flex flex-col bg-white border-gray-200 gap-4">
      <Suspense key={searchParamsKey} fallback={<TableSkeleton />}>
        <InstrumentsDataLoader
          searchParams={searchParams}
          currentPage={currentPage}
          Juzgados={Juzgados}
          instrumentosType={instrumentosType}
          zonas={zonas}
        />
      </Suspense>
    </div>
  );
}

