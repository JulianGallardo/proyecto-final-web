

import { Pagination,  PaginationContent, PaginationLink } from "@/components/ui/pagination"

interface PaginationInstrumentsProps {
    currentPage: number;
    totalPages: number;
    query?: string;
}
export default function PaginationInstruments({ currentPage, totalPages,query }: Readonly<PaginationInstrumentsProps>) {
    
  
    const urlParams = new URLSearchParams(query)

    function replacePage(page: number) {
        
        urlParams.set('page', page.toString())
        return urlParams.toString()
    }

    

    return (
        <Pagination >
            <PaginationContent>
                {totalPages > 1 &&
                    Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                       <PaginationLink key={page} href={`?${replacePage(page)}`} isActive={page === currentPage} size="icon">
                            {page}
                        </PaginationLink>
                    ))
                }

            </PaginationContent>

        </Pagination>
    )
}
