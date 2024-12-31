import ZoneCard from "@/components/areas/ui/ZoneList/ZoneCard";
import { CustomFeature } from "@/types/MapTypes";


interface ZoneListProps {
    zones: CustomFeature[];
    onDelete: (zone: CustomFeature) => void;
    onEdit: (zone: CustomFeature) => void;
    editing: boolean;
}



export default function ZoneList({ zones, onDelete,editing, onEdit}: ZoneListProps) {
    return (
        <div className="flex flex-col gap-5 items-center w-full  ">
            
            <div className="flex flex-col flex-grow gap-2 w-full p-2">
                {zones.map((zone) => (
                    <ZoneCard
                        key={zone.id as string}
                        zoneName={zone.properties.name }
                        Feature={zone}
                        onDelete={() => onDelete(zone)}
                        editing={editing}
                        onEdit={() => onEdit(zone)}
                    />
                ))}
            </div>

        </div>
    );
}