

export function TableSkeleton() {
    return (



        <div className="animate-pulse flex flex-col items-center justify-center w-full space-y-3">

            <div className="flex flex-col gap-2 w-full h-10 px-4">
                <FiltersSkeleton />
            </div>

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

function FiltersSkeleton() {
    return (
        <div className="flex flex-col md:flex-row md:justify-between  w-full h-full">
            {Array.from({ length: 2 }, (_, i) => (
                <div
                    key={i}
                    className="w-20 h-10 bg-gray-200 rounded-md"
                ></div>
            ))}
        </div>
    );
}

function PaginationSkeleton() {
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