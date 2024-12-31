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
    onDelete: () => void;
    editing: boolean;
}

export default function ZoneCard({ zoneName, Feature, onDelete, editing }: ZoneCardProps) {
    const { properties } = Feature;
    const [zoneColor, setZoneColor] = useState<string>(properties?.color || "#FFFFFF");

    useEffect(() => {
        if (properties?.color) {
            setZoneColor(properties.color);
        }
    }, [properties?.color]);

    return (
        <div className="flex flex-col gap-3 p-3 shadow-lg border border-gray-200 rounded-lg bg-gradient-to-r from-white to-gray-50 hover:shadow-xl transition-shadow w-full">
            {/* Contenedor principal */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 w-full">
                {/* Nombre de la zona */}
                <span className="text-sm font-bold md:text-md  truncate w-full">
                    {zoneName}
                </span>

                {/* Color de la zona */}
                <span
                    className="w-8 h-8 sm:w-6 sm:h-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: zoneColor }}
                ></span>
            </div>

            {editing && (
                <div className="flex flex-row sm:flex-row gap-4 w-full items-center justify-start">
                    {/* Botón Renombrar */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button className="bg-blue-500 hover:bg-blue-800">
                                <Pencil />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Renombrar zona</p>
                        </TooltipContent>
                    </Tooltip>

                    {/* Botón Borrar */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button className="bg-red-500 hover:bg-red-800" onClick={onDelete}>
                                <Trash />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Borrar Zona</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            )}
        </div>
    );
}

