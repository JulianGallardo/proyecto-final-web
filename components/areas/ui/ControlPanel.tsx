// App.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Sidebar() {
    return (
        <div className="flex flex-col w-1/4 h-full bg-gray-100 shadow-lg p-5">
            {/* Encabezado */}
            <div className="mb-5">
                <h1 className="text-2xl font-bold text-gray-800">Controles</h1>
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-col gap-4 mb-5">
                <Button className="w-full" variant="default">
                    Agregar Zona
                </Button>
                <Button className="w-full" variant="secondary">
                    Desplazar
                </Button>
                <Button className="w-full" variant="secondary">
                    Calcular Zona
                </Button>
            </div>

            {/* Separador */}
            <Separator className="mb-5" />

            {/* Listado de Zonas */}
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Zonas</h2>
                <ul className="space-y-3">
                    {/* Aquí puedes renderizar dinámicamente las zonas */}
                    <li className="flex items-center justify-between p-3 bg-gray-200 rounded-md shadow-sm">
                        <span className="text-gray-700">Zona 1</span>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                                Editar
                            </Button>
                            <Button size="sm" variant="destructive">
                                Eliminar
                            </Button>
                        </div>
                    </li>
                    <li className="flex items-center justify-between p-3 bg-gray-200 rounded-md shadow-sm">
                        <span className="text-gray-700">Zona 2</span>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                                Editar
                            </Button>
                            <Button size="sm" variant="destructive">
                                Eliminar
                            </Button>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}
