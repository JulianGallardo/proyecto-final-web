import { useMediaQuery } from "@/hooks/use-media-query";
import SlideableSheet from "@/components/ui/slideable-sheet";
import PreviewContent from "./PreviewContent";
import { MapComponent } from "../mapRoute";
import { InstrumentoExtendido } from "@/types/instrumentoTypes";
import { useRoutePlanner } from "@/hooks/use-route";
import { useState } from 'react';
import Controls from "./Controls";

interface RoutePlannerProps {
    instruments: InstrumentoExtendido[];
    volver: () => void;
}

export default function RoutePlanner({ instruments, volver }: Readonly<RoutePlannerProps>) {
    const {
        orderedAddresses,
        routeSegments,
        selectedInstruments,
        routeMetrics,
    } = useRoutePlanner(instruments);

    const [sheetOpen, setSheetOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return (
        <div className="h-full w-full relative">
            <div className="w-full h-full">
                <MapComponent
                    orderedAddresses={orderedAddresses}
                    routeSegments={routeSegments}
                    selectedInstruments={selectedInstruments}
                />
            </div>

            {isDesktop ? (
                <div className="absolute top-0 left-0 w-1/3 h-full p-6 bg-gray-100 shadow-lg overflow-y-auto">
                    <Controls volver={volver} instrumentos={instruments} />
                </div>
            ) : (
                <SlideableSheet
                    isOpen={sheetOpen}
                    onOpenChange={setSheetOpen}
                    preview={<PreviewContent routeMetrics={routeMetrics} />}
                >
                    <div className="flex flex-col gap-4">
                        <Controls volver={volver} instrumentos={instruments} />
                    </div>
                </SlideableSheet>
            )}
        </div>
    );
}