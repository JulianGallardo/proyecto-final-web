"use client";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { usePathname, useSearchParams } from "next/navigation";
import {  useMemo } from "react";

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


 


    const generatePagination = (totalPages: number, currentPage: number): (number | string)[] => {
        const pageNumbers: (number | string)[] = [];
    
        if (totalPages <= 1) return [1]; // Si solo hay una página, solo mostramos "1".
    
        pageNumbers.push(1); // Siempre incluimos la primera página.
    
        if(((currentPage - 2) >= 3)) {
            pageNumbers.push("..."); // Si el número de página actual es mayor a 3, agregamos "...".
        }

        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
            if (i > 1 && i < totalPages) {
                pageNumbers.push(i);
            }
        }

        if(((currentPage + 2) <= totalPages - 2)) {
            pageNumbers.push("..."); // Si el número de página actual es menor a totalPages - 2, agregamos "...".
        }

        pageNumbers.push(totalPages); // Siempre incluimos la última página.




    
        return pageNumbers;
    };

    const pageNumbers = useMemo(() => generatePagination(totalPages, currentPage), [totalPages, currentPage]);

    return (
        <div className="flex flex-row p-2 overflow-hidden">
            <Pagination>
                <PaginationContent>
                    {currentPage > 1 && <PaginationPrevious href={createPageURL(currentPage - 1)} />}
                    {pageNumbers.map((page, index) =>
                        page === "..." ? (
                            <PaginationEllipsis key={"Pagination"+index} />
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
