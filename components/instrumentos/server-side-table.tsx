import { getInstrumentosPaginated } from "@/actions/instrumentos-actions";
import { TablaInstrumentos } from "./tabla-instrumento";
import { useEffect, useState, useMemo } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "../ui/pagination";
import { InstrumentoExtendido } from "@/types/instrumento";
import { useSearchParams } from "next/navigation";

interface ServerSideTable {
    onEdit: (instrumento: any) => void;
    onDelete: (id: string) => void;
}

export default function ServerSideTable({ onEdit, onDelete }: Readonly<ServerSideTable>) {


    const searchParams = useSearchParams()
    const currentPage = parseInt(searchParams.getAll("page")?.[0] || "1")

    const [data, setData] = useState<InstrumentoExtendido[][]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    // Memorizar la query sin el parámetro de página
    const queryWithoutPage = useMemo(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("page");
        return params.toString();
    }, [searchParams]);

    useEffect(() => {
        const fetchInstrumentos = async () => {
            setLoading(true);
            const { paginatedPages, totalPages } = await getInstrumentosPaginated(queryWithoutPage, currentPage);
            setData(paginatedPages);
            setTotalPages(totalPages);
            setLoading(false);
        };

        // Solo hacer la llamada cuando query o currentPage cambien
        fetchInstrumentos();
    }, [queryWithoutPage, currentPage]);

    return (
        <div className="flex flex-col p-4 bg-white border-gray-200 gap-2">
            <TablaInstrumentos
                currentPage={currentPage}
                onDelete={onDelete}
                onEdit={onEdit}
                data={data}
                loading={loading}
            />

            {loading ? (
                <PaginationSkeleton />
            ) : (
                <Pagination className="mt-4">
                    <PaginationContent className="flex space-x-2">
                        {totalPages > 0 &&
                            Array.from({ length: totalPages }, (_, i) => (
                                <PaginationItem key={i + 1} className="text-sm">
                                    <PaginationLink
                                        href={`?page=${i + 1}`}
                                        className="px-3 py-1 rounded-md border border-gray-300 bg-gray-100 hover:bg-blue-500 hover:text-white transition-colors duration-200"
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}

export function TableSkeleton() {
    return (
        <div className="animate-pulse flex flex-col items-center justify-center w-full space-y-3">
            <div className="w-full h-10 bg-gray-200 rounded-md"></div>
            <div className="w-full h-10 bg-gray-200 rounded-md"></div>
            <div className="w-full h-10 bg-gray-200 rounded-md"></div>
            <div className="w-full h-10 bg-gray-200 rounded-md"></div>
            <div className="w-full h-10 bg-gray-200 rounded-md"></div>
        </div>
    );
}

export function PaginationSkeleton() {
    return (
        <div className="flex items-center justify-center w-full space-x-2">
            <div className="w-10 h-10 bg-gray-200 rounded-md"></div>
            <div className="w-10 h-10 bg-gray-200 rounded-md"></div>
            <div className="w-10 h-10 bg-gray-200 rounded-md"></div>
            <div className="w-10 h-10 bg-gray-200 rounded-md"></div>
        </div>
    );
}
