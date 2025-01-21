import { Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import { Pencil, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { InstrumentoExtendido } from "@/types/instrumento";

interface AccionesListProps {
    onEdit: (instrumento: InstrumentoExtendido) => void;
    onDelete: (id: string) => void;
    instrumento: InstrumentoExtendido;
    openDelete: string | null;
    setOpenDelete: (id: string | null) => void;
    }


export default function AccionesList({
    onEdit,
    instrumento,
    openDelete,
    setOpenDelete,
    }: Readonly<AccionesListProps>) {


      
    return (
        <div className="flex flex-row gap-4 items-center p-2 w-full h-full">
          {/* Botón Editar */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="bg-blue-500 hover:bg-blue-600"
                onClick={() => onEdit(instrumento)}
              >
                <Pencil className="h-4 w-4 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Editar</p>
            </TooltipContent>
          </Tooltip>

          {/* Botón Eliminar */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="bg-red-500 hover:bg-red-600"
                onClick={() => console.log(instrumento.caratula)}
              >
                <Trash className="h-4 w-4 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Eliminar</p>
            </TooltipContent>
          </Tooltip>

          {/* Confirmar Eliminación */}
          {openDelete === instrumento.caratula && (
            <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-lg font-bold">
                  ¿Estás seguro de eliminar este instrumento?
                </p>
                <div className="flex gap-4 mt-4">
                  <Button
                    className="bg-red-500 hover:bg-red-600"
                    onClick={() => {
                      //onDelete(instrumento.id);
                      setOpenDelete(null);
                    }}
                  >
                    Confirmar
                  </Button>
                  <Button
                    className="bg-gray-500 hover:bg-gray-600"
                    onClick={() => setOpenDelete(null)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
}