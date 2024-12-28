import { useEffect, useState } from "react";

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
        <div className="flex flex-row items-center justify-between p-5 shadow-lg border border-gray-200 rounded-lg bg-gradient-to-r from-white to-gray-50 hover:shadow-xl transition-shadow w-full">
            {/* Nombre de la zona e indicador de color */}
            <div className="flex items-center space-x-3">
                <span className="text-lg font-bold text-gray-800 sm:text-base">{zoneName}</span>
                <span
                    className="w-6 h-6 sm:w-4 sm:h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: zoneColor }}
                ></span>
            </div>

            {/* Botones de acción */}
            <div className="flex space-x-3">
                <button
                    onClick={onEdit}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 transition sm:px-2 sm:py-1 sm:text-sm"
                >
                    Editar
                </button>
                <button
                    onClick={onDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300 transition sm:px-2 sm:py-1 sm:text-sm"
                >
                    Borrar
                </button>
            </div>
        </div>
    );
}
