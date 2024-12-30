import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Pencil, Plus,Save  } from "@mynaui/icons-react";

interface PanelHeaderProps {
    onEdit: () => void;
    saveChanges: () => void;
    addZone: () => void;
    mode: string;
}



export default function PanelHeader({ onEdit, addZone, mode,saveChanges }: PanelHeaderProps) {
    return (
        <div className="flex flex-col w-full pt-5 pb-5  gap-5 items-center justify-center">
            <div className="flex flex-col    items-center justify-center">
                <h2 className="text-xl font-semibold items-center justify-center text-gray-800 mb-3">Zonas</h2>
                <h4 className="text-sm text-gray-500">Administra las zonas de tu área</h4>
            </div>

            <div className="w-full  bg-gray-200 p-2 rounded-lg text-sm text-center font">
                <p>Modo: {mode}</p>
            </div>

            <div className="flex flex-row gap-5">
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
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button className="bg-blue-500 hover:bg-blue-800" onClick={
                            mode === "Editando Zonas" ? saveChanges : onEdit
                        }>
                            {
                                mode === "Editando Zonas" ? <Save /> : <Pencil />
                            }
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{mode === "Editando Zonas" ? "Guardar cambios" : "Editar zonas"}</p>
                    </TooltipContent>
                </Tooltip>
            </div>




        </div>

    );
}

