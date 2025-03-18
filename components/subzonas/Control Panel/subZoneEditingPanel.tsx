import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {  DrawingModesSubZonas } from "@/types/MapTypes";
import { Pencil, Plus, Save, Undo, XOctagon } from "@mynaui/icons-react";

interface EditingPanelProps {
    onEdit: () => void;
    saveSubZoneEdits: () => void;
    discardSubZoneEdits: () => void;

    saveChanges: () => void;
    discardChanges: () => void;
    addSubZone: () => void;
    mode: DrawingModesSubZonas;
    setRenderMode: () => void;

}





export default function SubZoneEditingPanel({ onEdit, addSubZone, mode, saveSubZoneEdits, discardSubZoneEdits, saveChanges, setRenderMode, discardChanges }: Readonly<EditingPanelProps>) {
    return (
        <div className="flex flex-col w-full   gap-5 items-center justify-center">
            <div className="w-full  bg-gray-200 p-2 rounded-lg text-sm text-center font">
                <p>Modo: {mode}</p>
            </div>

            <div className="flex flex-row gap-3">
                {
                    mode === DrawingModesSubZonas.SinSeleccionar &&
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
                {
                    mode === DrawingModesSubZonas.SinSeleccionar &&
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button className="bg-green-500 hover:bg-green-800" onClick={addSubZone}>
                                <Plus />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Agregar subzona</p>
                        </TooltipContent>
                    </Tooltip>

                }

                {
                    mode === DrawingModesSubZonas.CreandoSubZonas &&
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button className="bg-red-500 hover:bg-red-800" onClick={setRenderMode} >
                                <XOctagon />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Cancelar creación</p>
                        </TooltipContent>
                    </Tooltip>

                }


                {
                    mode !== DrawingModesSubZonas.CreandoSubZonas &&
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button className="bg-blue-500 hover:bg-blue-800" onClick={
                                mode === DrawingModesSubZonas.EditandoSubZonas ? saveSubZoneEdits : onEdit
                            }>
                                {
                                    mode === DrawingModesSubZonas.EditandoSubZonas ? <Save /> : <Pencil />
                                }
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{mode === DrawingModesSubZonas.EditandoSubZonas ? "Guardar cambios" : "Editar subzonas"}</p>
                        </TooltipContent>
                    </Tooltip>

                }


                {
                    (mode === DrawingModesSubZonas.SinSeleccionar || mode === DrawingModesSubZonas.EditandoSubZonas) &&
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button onClick={
                                (mode === DrawingModesSubZonas.SinSeleccionar) ? ()=>discardChanges() : ()=>discardSubZoneEdits()

                            } className="bg-red-500 hover:bg-red-800">
                                <Undo />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Descartar cambios</p>
                        </TooltipContent>
                    </Tooltip>
                }




            </div>


        </div>
    );
}