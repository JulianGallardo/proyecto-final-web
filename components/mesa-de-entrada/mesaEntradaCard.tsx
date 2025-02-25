import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { parseDate } from "@/lib/utils";
import { User } from "@prisma/client";
export function MesaEntradaCard({ personal, onDelete }: Readonly<{ personal: User; onDelete: () => void }>) {
    return (
        <Card className="shadow-lg rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">

            <CardContent className="flex flex-col items-start p-6 bg-white flex-grow min-h-[140px]">
                <h2 className="text-2xl font-bold text-gray-800">{personal.name}{" "}{personal.lastname}</h2>
                <p className="text-sm text-gray-600">Email: {personal.email}</p>

                <p className="text-sm text-gray-500">Creado: {parseDate(personal.createdAt?.toISOString())}</p>
                <p className="text-sm text-gray-500">Actualizado: {parseDate(personal.updatedAt?.toISOString())}</p>
            </CardContent>

            {/* Siempre pegado abajo */}
            <CardFooter className="flex justify-between p-4 bg-gray-100 border-t">

                <Button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors" onClick={onDelete}>
                    <Trash2 className="h-4 w-4" /> Eliminar
                </Button>
            </CardFooter>
        </Card>
    );
}
