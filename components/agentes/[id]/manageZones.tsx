import { getAllZonesWithAgents } from "@/actions/zone-actions";
import { ZoneDto } from "@/types/ZoneTypes";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save } from "@mynaui/icons-react";

export default function ManageZones() {
    const [zones, setZones] = useState<ZoneDto[]>([]);
    const [selectedZones, setSelectedZones] = useState<string[]>([]);

    useEffect(() => {
        const fetchZones = async () => {
            const data = await getAllZonesWithAgents();
            setZones(data);
        };

        fetchZones();
    }, []);

    const handleZoneToggle = (zoneId: string) => {
        setSelectedZones((prev) =>
            prev.includes(zoneId) ? prev.filter((id) => id !== zoneId) : [...prev, zoneId]
        );
    };

    return (
        <div className="w-full flex flex-col  gap-2 ">

            <div className="space-y-3 w-full">
                {zones.map((zone) => (
                    <div key={zone.id} className="flex items-center gap-3 border p-3 rounded-lg w-full">
                        <Checkbox
                            id={zone.id}
                            checked={selectedZones.includes(zone.id)}
                            onCheckedChange={() => handleZoneToggle(zone.id)}
                        />
                        <Label htmlFor={zone.id} className="flex flex-row gap-2 text-gray-700 items-center ">
                            <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: zone.zoneColor }}
                            >
                            </div>
                            <span className="font-medium">{zone.zoneName}</span>
                            <span className="text-sm text-gray-500 ml-2">
                                {zone.Agentes.length > 0
                                    ? `Agentes: ${zone.Agentes.map(a => a.user.name).join(", ")}`
                                    : "Sin agentes asignados"}
                            </span>
                        </Label>
                    </div>

                ))}
            </div>
            <div className="flex justify-end w-full">
                <Button className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    <span className="mr-2">Guardar cambios</span>
                    <Save className="w-6 h-6" />
                </Button>
            </div>
        </div>
    );
}
