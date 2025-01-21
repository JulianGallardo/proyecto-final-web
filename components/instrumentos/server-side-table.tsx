import { getInstrumentosPaginated } from "@/actions/instrumentos-actions";
import { TablaInstrumentos } from "./tabla-instrumento";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "../ui/pagination";

interface ServerSideTableProps {
  query: string;
  currentPage: number;
}

export default async function ServerSideTable({
  query,
  currentPage,
}: Readonly<ServerSideTableProps>) {

  const { instrumentos, totalPages } = await getInstrumentosPaginated(
    query,
    currentPage
  );


  return (
    <div className="flex flex-col p-4 bg-white border-gray-200 gap-4">
      <TablaInstrumentos data={instrumentos} totalPages={totalPages} currentPage={currentPage}/>

      
    </div>
  );
}

export function TableSkeleton() {
    return (
      <div className="animate-pulse flex flex-col items-center justify-center w-full space-y-3">
        <div className="flex flex-col gap-2 w-full h-full px-4">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="w-full h-10 bg-gray-200 rounded-md"
            ></div>
          ))}
        </div>
        <PaginationSkeleton />
      </div>
    );
  }
  
  export function PaginationSkeleton() {
    return (
      <div className="flex items-center justify-center w-full space-x-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="w-10 h-10 bg-gray-200 rounded-md"
          ></div>
        ))}
      </div>
    );
  }
  
