import { useEffect, useState } from "react";
import { Trash, Pencil } from "@mynaui/icons-react";
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface ZoneCardProps {
    zoneName: string;
    Feature: GeoJSON.Feature;
    onEdit: () => void;
    onDelete: () => void;
}

export default function ZoneCard({ zoneName, Feature, onEdit, onDelete }: ZoneCardProps) {
    const { properties } = Feature;
    const [zoneColor, setZoneColor] = useState<string>(properties?.color || "#FFFFFF");

    useEffect(() => {
        if (properties?.color) {
            setZoneColor(properties.color);
        }
    }, [properties?.color]);

    return (
        <div className="flex flex-row items-center justify-between gap-4 p-3 shadow-lg border border-gray-200 rounded-lg bg-gradient-to-r from-white to-gray-50 hover:shadow-xl transition-shadow w-full">
            {/* Nombre de la zona e indicador de color */}
            <div className="flex items-center space-x-3">
                <span className="text-lg font-bold text-gray-800 sm:text-base">{zoneName}</span>
                <span
                    className="w-6 h-6 sm:w-4 sm:h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: zoneColor }}
                ></span>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-5 w-full">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button className="bg-blue-500 hover:bg-blue-800"   onClick={onEdit}>
                            <Pencil />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Editar zona</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button  className="bg-red-500 hover:bg-red-800" onClick={onDelete}>
                            <Trash />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Borrar Zona</p>
                    </TooltipContent>
                </Tooltip>


            </div>
        </div >
    );
}
