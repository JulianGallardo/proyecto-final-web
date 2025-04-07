import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InstrumentoExtendido } from "@/types/instrumentoTypes";
import { Eye } from "@mynaui/icons-react";
import { useRouter } from "next/navigation";


interface ColumnsProps {
  Instrumento: InstrumentoExtendido;
  onEdit: (Instrumento: InstrumentoExtendido) => void;
  onDelete: (Instrumento: InstrumentoExtendido) => void;
}

export default function AccionesList({ Instrumento, onEdit, onDelete }: Readonly<ColumnsProps>) {

  const router = useRouter();


  return (
    <div className="flex flex-row gap-4 items-center justify-center  p-2 w-full h-full">

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="bg-green-500 hover:bg-green-600"
            onClick={() =>
              router.push(`/instrumentos/ver/${Instrumento.codigoInstrumento}`)
            }
          >
            <Eye className="h-4 w-4 text-white" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Ver mas</p>
        </TooltipContent>
      </Tooltip>

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