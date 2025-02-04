import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Eye } from "@mynaui/icons-react";
import { AgenteExtendidoDto } from "@/types/agenteTypes";
import { parseDate } from "@/lib/utils";
import Link from "next/link";

export function AgenteCard({ agente, onDelete }: Readonly<{ agente: AgenteExtendidoDto; onDelete: () => void }>) {



    return (
        <Card className="shadow-lg rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <CardContent className="flex flex-col items-start p-6 bg-white">
                <h2 className="text-2xl font-bold text-gray-800">{agente.user.name}</h2>
                <p className="text-sm text-gray-600">Email: {agente.user.email}</p>
                <p className="text-sm text-gray-600">Zonas: {
                    agente.zonas.map((zona) => zona.zoneName).join(", ")
                }</p>
                <p className="text-sm text-gray-500">Creado: {parseDate(agente.createdAt?.toISOString())}</p>
                <p className="text-sm text-gray-500">Actualizado: {parseDate(agente.updatedAt?.toISOString())}</p>
            </CardContent>
            <CardFooter className="flex justify-between p-4 bg-gray-100 border-t ">

                <Link href={`/agentes/${agente.id}`}>
                    <Button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors" >
                        <Eye className="h-4 w-4" /> Ver detalles
                    </Button>
                </Link>
                <Button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors" onClick={onDelete}>
                    <Trash2 className="h-4 w-4" /> Eliminar
                </Button>
            </CardFooter>
        </Card>
    );
}