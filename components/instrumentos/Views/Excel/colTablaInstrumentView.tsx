import { ColumnDef } from "@tanstack/react-table";
import {  InstrumentoExtendido, InstrumentoTypeDTO } from "@/types/instrumentoTypes";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckIcon, XIcon, Edit, Trash2 as Delete } from "lucide-react";
import { ExtendedZone } from "@/types/ZoneTypes";

import {
    CaratulaCell,
    JuzgadoCell,
    DomicilioCell,
    ZonaCell,
    SubZonaCell,
    ObservacionesCell,
} from "./cellComponentsExcelView";

export const getColumns = ({
    editingIndex,
    Juzgados,
    zonas,
    saveChanges,
    cancelEditing,
    startEditing,
    onDelete,
}: {
    editingIndex: number;
    Juzgados: JuzgadoDto[];
    instrumentoTypes: InstrumentoTypeDTO[];
    zonas?: ExtendedZone[];
    saveChanges: () => void;
    cancelEditing: () => void;
    startEditing: (index: number) => void;
    onDelete: (instrumento: InstrumentoExtendido) => void;
}): ColumnDef<InstrumentoExtendido>[] => [
        {
            accessorKey: "caratula",
            header: "Carátula",
            cell: ({ row }) => <CaratulaCell row={row} editingIndex={editingIndex} />,
        },
        {
            accessorKey: "codigoInstrumento",
            header: "Codigo",
            cell: ({ row }) => <p>{row.original.codigoInstrumento}</p>,
        },
        
        {
            accessorKey: "orden.juzgado",
            header: "Juzgado",
            cell: ({ row }) => (
                <JuzgadoCell row={row} editingIndex={editingIndex} Juzgados={Juzgados} />
            ),
        },
        {
            accessorKey: "N ° de orden", 
            header: "N ° de orden",
            cell: ({ row }) => <p  >{row.original.orden.ordenNumber}</p>,
        },
        {
            accessorKey: "domicilio_denunciado",
            header: "Domicilio",
            cell: ({ row }) => <DomicilioCell row={row} editingIndex={editingIndex} />,
        },
        {
            accessorKey: "zoneName",
            header: "Zona",
            cell: ({ row }) => <ZonaCell row={row} editingIndex={editingIndex} zonas={zonas} />,
        },
        {
            accessorKey: "subZona",
            header: "SubZona",
            cell: ({ row }) => (
                <SubZonaCell row={row} editingIndex={editingIndex} zonas={zonas} />
            ),
        },
        {
            accessorKey: "observaciones",
            header: "Observaciones",
            cell: ({ row }) => <ObservacionesCell row={row} editingIndex={editingIndex} />,
        },

        {
            accessorKey: "acciones",
            header: "Acciones",
            cell: ({ row }) => {
                const isEditing = row.index === editingIndex;

                return isEditing ? (
                    <div className="flex gap-2 justify-center">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className="bg-green-500 hover:bg-green-600"
                                    onClick={() => saveChanges()}
                                >
                                    <CheckIcon className="h-4 w-4 text-white" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Guardar cambios</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className="bg-red-500 hover:bg-red-600"
                                    onClick={() => cancelEditing()}
                                >
                                    <XIcon className="h-4 w-4 text-white" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Cancelar</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                ) : (
                    <div className="flex gap-2 justify-center">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className="bg-blue-500 hover:bg-blue-600"
                                    onClick={() => startEditing(row.index)}
                                >
                                    <Edit className="h-4 w-4 text-white" />
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
                                    onClick={() => onDelete(row.original)}
                                >
                                    <Delete className="h-4 w-4 text-white" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Eliminar</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                );
            },
        },

    ];
