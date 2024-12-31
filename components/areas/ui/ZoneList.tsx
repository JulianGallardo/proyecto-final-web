import ZoneCard from "@/components/areas/ui/ZoneCard";
import { CustomFeature } from "./ControlPanel";


interface ZoneListProps {
    zones: CustomFeature[];
    onDelete: (zone: CustomFeature) => void;
}



export default function ZoneList({ zones, onDelete }: ZoneListProps) {
    return (
        <div className="flex flex-col gap-5 items-center w-full  ">
            
            <div className="flex flex-col flex-grow gap-2">
                {zones.map((zone) => (
                    <ZoneCard
                        key={zone.id as string}
                        zoneName={zone.properties.name }
                        Feature={zone}
                        onDelete={() => onDelete(zone)}
                    />
                ))}
            </div>

        </div>
    );
}