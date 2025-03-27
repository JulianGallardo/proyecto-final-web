import { FilterProvider } from "@/contexts/filtersContext"


export default function InstrumentosLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex flex-col h-full w-full">
            <FilterProvider>
                {children}
            </FilterProvider>
        </div>
    )
}