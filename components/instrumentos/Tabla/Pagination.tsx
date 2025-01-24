
"use client";
import { Pagination, PaginationContent, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationInstrumentsProps {
    totalPages: number;
}
export default function PaginationInstruments({ totalPages }: Readonly<PaginationInstrumentsProps>) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };


    return (
        <Pagination >
            <PaginationContent>

                {
                    currentPage > 1 && <PaginationPrevious href={createPageURL(currentPage - 1)} />
                }

                {totalPages > 1 &&
                    Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <PaginationLink key={page} isActive={page === currentPage} href={createPageURL(page)}>{page}</PaginationLink>
                    ))
                }
                {
                    currentPage < totalPages && <PaginationNext href={createPageURL(currentPage + 1)} />
                    }


            </PaginationContent>

        </Pagination>
    )
}
