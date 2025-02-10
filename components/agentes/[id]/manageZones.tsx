"use client";

import { updateZonesAgents } from "@/actions/zone-actions";
import { ZoneDto } from "@/types/ZoneTypes";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save } from "@mynaui/icons-react";
import { AgenteExtendidoDto } from "@/types/agenteTypes";
import { toast } from "@/hooks/use-toast";

interface ManageZonesProps {
    agente: AgenteExtendidoDto;
    zones: ZoneDto[];
}

export default function ManageZones({ agente, zones }: Readonly<ManageZonesProps>) {
    const [selectedZones, setSelectedZones] = useState<string[]>([]);
    const [deselectedZones, setDeselectedZones] = useState<string[]>([]);
    const [agenteZones, setAgenteZones] = useState<string[]>([]);

    useEffect(() => {
        if (zones.length > 0) {
            const agenteZones = zones
                .filter((zone) => zone.Agentes.some((a) => a.user.name === agente.user.name))
                .map((zone) => zone.id);
            setSelectedZones(agenteZones);
            setAgenteZones(agenteZones);
        }
    }, [zones, agente]);

    const handleZoneToggle = (zoneId: string) => {
        if (selectedZones.includes(zoneId)) {
            setSelectedZones(selectedZones.filter((id) => id !== zoneId));
            if (agenteZones.includes(zoneId)) {
                setDeselectedZones([...deselectedZones, zoneId]);
            }
        } else {
            setSelectedZones([...selectedZones, zoneId]);
            if (!agenteZones.includes(zoneId)) {
                setDeselectedZones(deselectedZones.filter((id) => id !== zoneId));
            }
        }
    };

    const handleSaveChanges = async () => {
        const response = await updateZonesAgents(selectedZones, deselectedZones, agente.id);
        if (response.success) {
            toast({
                title: "Agente registrado en zonas",
                description: "El agente ha sido registrado con éxito en las zonas correspondientes.",
                className: "bg-green-500 text-white",
                duration: 3000,
            });
            setAgenteZones([...selectedZones]);
            setDeselectedZones([]);
        } else {
            toast({
                title: "Error",
                description: "Ha ocurrido un error al registrar el nuevo agente en las zonas.",
                className: "bg-red-500 text-white",
                duration: 3000,
            });
        }
    };

    // Comprobar si hay cambios
    const hasChanges = JSON.stringify(selectedZones.sort()) !== JSON.stringify(agenteZones.sort());

    return (
        <div className="w-full flex flex-col gap-2">
            <div className="space-y-3 w-full">
                {zones.length === 0 ? (
                    <div className="p-4 bg-gray-50 rounded-lg flex flex-col items-center gap-2 h-full w-full">
                        <p className="text-lg font-semibold text-gray-400">No hay zonas registradas</p>
                    </div>
                ) : (
                    zones.map((zone) => (
                        <div key={zone.id} className="flex items-center gap-3 border p-3 rounded-lg w-full">
                            <Checkbox
                                id={zone.id}
                                checked={selectedZones.includes(zone.id)}
                                onCheckedChange={() => handleZoneToggle(zone.id)}
                            />
                            <Label htmlFor={zone.id} className="flex flex-row gap-2 text-gray-700 items-center">
                                <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: zone.zoneColor }}
                                />
                                <span className="font-medium">{zone.zoneName}</span>
                                <span className="text-sm text-gray-500 ml-2">
                                    {zone.Agentes.length > 0
                                        ? `Agentes: ${zone.Agentes.map(a => a.user.name).join(", ")}`
                                        : "Sin agentes asignados"}
                                </span>
                            </Label>
                        </div>
                    ))
                )}
            </div>
            <div className="flex justify-end w-full">
                <Button
                    className={`font-semibold px-4 py-2 rounded-lg transition ${
                        hasChanges
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={handleSaveChanges}
                    disabled={!hasChanges}
                >
                    <span className="mr-2">Guardar cambios</span>
                    <Save className="w-6 h-6" />
                </Button>
            </div>
        </div>
    );
}
