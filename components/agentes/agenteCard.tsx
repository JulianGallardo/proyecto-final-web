
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Pencil } from "@mynaui/icons-react";
import { AgenteTypeDTO } from "@/types/agenteTypes";
import { parseDate } from "@/lib/utils";


export function AgenteCard({ agente, onEdit, onDelete }: Readonly<{ agente:AgenteTypeDTO; onEdit: () => void; onDelete: () => void }>) {
    return (
        <Card >
            <CardContent className="flex flex-col items-start p-4 h-2/3">
                <h2 className="text-xl font-bold">{agente.name}</h2>
                <p className="text-sm text-gray-500">Creado: {parseDate(agente.createdAt?.toISOString())}</p>
                <p className="text-sm text-gray-500">Actualizado: {parseDate(agente.updatedAt?.toISOString())}</p>
            </CardContent>
            <CardFooter className="flex justify-between p-4">
                <Button className="bg-blue-500 hover:bg-blue-600" onClick={onEdit}>
                    <Pencil className="mr-2 h-4 w-4" /> Editar
                </Button>
                <Button className="bg-red-500 hover:bg-red-600" onClick={onDelete}>
                    <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                </Button>
            </CardFooter>
        </Card>
    )
}
