import { getInstrumentosPaginated, getTotalPagesInstrumentosPaginated } from "@/actions/instrumentos-actions";
import { InstrumentoType, Juzgado } from "@prisma/client";
import { ExtendedZone } from "@/types/ZoneTypes";
import SearchParamsInstrumentos from "@/types/searchParams";
import { CrudInstrumentos } from "../../crud-instrumento";
import PaginationInstruments from "../../../shared/Pagination";

interface InstrumentsDataLoaderProps {
  searchParams: SearchParamsInstrumentos;
  currentPage: number;
  Juzgados: Juzgado[];
  instrumentosType: InstrumentoType[];
  zonas: ExtendedZone[];
}

export default async function InstrumentsDataLoader({
  searchParams,
  currentPage,
  Juzgados,
  instrumentosType,
  zonas,
}: Readonly<InstrumentsDataLoaderProps>) {
  // Esta función asíncrona provocará el estado de suspense
  const instrumentos = await getInstrumentosPaginated(searchParams, currentPage);
  const totalPages = await getTotalPagesInstrumentosPaginated(searchParams);

  return (
    <>
      <CrudInstrumentos instrumentos={instrumentos} Juzgados={Juzgados} instrumentoTypes={instrumentosType} zonas={zonas} />
      <PaginationInstruments totalPages={totalPages} />
    </>
  );
}
