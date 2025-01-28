"use client";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
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

    const pageNumbers: (number | string)[] = [];

    if (totalPages > 1) {
        pageNumbers.push(1);

        if (currentPage > 3) {
            pageNumbers.push("...");
        }

        for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
            pageNumbers.push(i);
        }

        if (currentPage < totalPages - 2) {
            pageNumbers.push("...");
        }

        if (totalPages > 1) {
            pageNumbers.push(totalPages);
        }
    }

    return (
        <div className="flex flex-row p-2 overflow-hidden">
            <Pagination>
                <PaginationContent>
                    {currentPage > 1 && <PaginationPrevious href={createPageURL(currentPage - 1)} />}
                    {pageNumbers.map((page, index) =>
                        page === "..." ? (
                            <PaginationEllipsis key={index} />
                        ) : (
                            <PaginationLink key={page} isActive={page === currentPage} href={createPageURL(page)}>
                                {page}
                            </PaginationLink>
                        )
                    )}
                    {currentPage < totalPages && <PaginationNext href={createPageURL(currentPage + 1)} />}
                </PaginationContent>
            </Pagination >
        </div >
    );
}
