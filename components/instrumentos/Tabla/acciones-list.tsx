import { Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InstrumentoExtendido } from "@/types/instrumentoTypes";


interface ColumnsProps {
  Instrumento: InstrumentoExtendido;
  onEdit: (Instrumento:InstrumentoExtendido) => void;
  onDelete: (Instrumento:InstrumentoExtendido) => void;
}

export default function AccionesList({ Instrumento, onEdit,onDelete }: Readonly<ColumnsProps>) {

  return (
    <div className="flex flex-row gap-4 items-center p-2 w-full h-full">
      

      {/* Botón Editar */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => onEdit(Instrumento)}
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
            onClick={() => onDelete(Instrumento)}
          >
            <Trash className="h-4 w-4 text-white" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Eliminar</p>
        </TooltipContent>
      </Tooltip>

    </div>
  );
}