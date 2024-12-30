import ZoneCard from "@/components/areas/ui/ZoneCard";
import { CustomFeature } from "./ControlPanel";


interface ZoneListProps {
    zones: CustomFeature[];
    onEdit: (zone: CustomFeature) => void;
    onDelete: (zone: CustomFeature) => void;
}



export default function ZoneList({ zones, onEdit, onDelete }: ZoneListProps) {
    return (
        <div className="flex flex-col gap-5 items-center w-full  ">
            <h2 className="text-xl font-semibold items-center justify-center text-gray-800 mb-3">Zonas</h2>
            <div className="flex flex-col flex-grow gap-2">
                {zones.map((zone) => (
                    <ZoneCard
                        key={zone.id as string}
                        zoneName={ "Zona"}
                        Feature={zone}
                        onEdit={() => onEdit(zone)}
                        onDelete={() => onDelete(zone)}
                    />
                ))}
            </div>

        </div>
    );
}