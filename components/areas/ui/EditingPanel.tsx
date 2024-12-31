import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DrawingModes } from "@/types/MapTypes";
import { Pencil, Plus, Save } from "@mynaui/icons-react";

interface EditingPanelProps {
    onEdit: () => void;
    saveZoneEdits: () => void;
    saveChanges: () => void;
    addZone: () => void;
    mode: DrawingModes;
}

export default function EditingPanel({ onEdit, addZone, mode, saveZoneEdits, saveChanges }: EditingPanelProps) {
    return (
        <div className="flex flex-col w-full   gap-5 items-center justify-center">
            <div className="w-full  bg-gray-200 p-2 rounded-lg text-sm text-center font">
                <p>Modo: {mode}</p>
            </div>

            <div className="flex flex-row gap-5">
                {
                    mode === DrawingModes.SinSeleccionar &&
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button onClick={() => saveChanges()} className="bg-gray-500 hover:bg-gray-800">
                                <Save />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Guardar cambios</p>
                        </TooltipContent>
                    </Tooltip>
                }

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button className="bg-green-500 hover:bg-green-800" onClick={addZone}>
                            <Plus />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Agregar zona</p>
                    </TooltipContent>
                </Tooltip>
                { 
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button className="bg-blue-500 hover:bg-blue-800" onClick={
                                mode === DrawingModes.EditandoZonas ? saveZoneEdits : onEdit
                            }>
                                {
                                    mode === DrawingModes.EditandoZonas ? <Save /> : <Pencil />
                                }
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{mode === DrawingModes.EditandoZonas ? "Guardar cambios" : "Editar zonas"}</p>
                        </TooltipContent>
                    </Tooltip>

                }




            </div>


        </div>
    );
}