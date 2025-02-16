
import SelectZona from "./SelectZona";
import { Suspense } from "react";
import TabGeneralSkeleton from "../TabSkeleton";
import TabZonas from "./TabZona";


interface TabGeneralProps {
    searchParams?: {
        agenteId?: string;
        zoneName?: string;
    }
    zonas: string[];
}


export default function ControllerTabZonas({ searchParams, zonas }: Readonly<TabGeneralProps>) {
    return (
        <div className="space-y-4">
            <SelectZona zoneNames={zonas} />
            <Suspense fallback={<TabGeneralSkeleton />}>
                <TabZonas searchParams={searchParams} />
            </Suspense>

        </div>
    );
}