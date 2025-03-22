import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ExtendedZone } from "@/types/ZoneTypes";
import { SadCircle, Trash } from "@mynaui/icons-react";
import { Edit2 } from "lucide-react";

interface SubZoneListProps {
    editing: boolean;
    handleEditSubzone: (subzoneId: string) => void;
    confirmDeleteSubzone: (subzoneId: string) => void;
    subZones: any[];
    zone: ExtendedZone;
}

export default function SubZoneList(
    {
        editing,
        handleEditSubzone,
        confirmDeleteSubzone,
        subZones,
        zone
    }: Readonly<SubZoneListProps>
) {
    return (
        <div>
            {subZones.length > 0 ? (
                <div className="flex flex-col gap-2">
                    {subZones.filter(subzona => subzona.id !== undefined).map((subzona) => {

                        const subzonaId = String(subzona.id || '');

                        return subzonaId && (
                            <Card
                                key={subzonaId}
                                className={`p-3 cursor-pointer borderhover:bg-gray-50 flex flex-col gap-3 shadow-lg border-gray-200 rounded-lg bg-gradient-to-r from-white to-gray-50 hover:shadow-xl transition-shadow`}

                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-6 h-6 rounded-full border border-gray-300"
                                            style={{ backgroundColor: zone.zoneColor }}
                                        />
                                        <p className="font-bold text-sm md:text-md truncate">{subzona.properties.name}</p>
                                    </div>


                                    {   editing &&
                                        <div className="flex items-center gap-2">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600 text-white"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditSubzone(subzonaId);
                                                        }}
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent side="top">
                                                    <p>Editar subzona</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 bg-red-500 hover:bg-red-800 text-white"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            confirmDeleteSubzone(subzonaId);
                                                        }}
                                                    >
                                                        <Trash className="w-4 h-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent side="top">
                                                    <p>Eliminar subzona</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    }

                                </div>


                            </Card>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <SadCircle className="w-10 h-10 text-gray-400 mb-3" />
                    <p className="text-gray-500 mb-2">No hay subzonas en esta área</p>

                </div>
            )}
        </div>
    );
}