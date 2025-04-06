import { InstrumentoExtendido } from "@/types/instrumentoTypes";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Button } from "../ui/button";
import IndicadorFecha from "../shared/indicador-fecha";
import { UrgenciaInstrumento } from "@prisma/client";
import { Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Link from "next/link";
import { Eye } from "@mynaui/icons-react";



const DemoraCell = ({ row }: { row: Row<InstrumentoExtendido> }) => {
    const fechaEntrada: Date = row.getValue("fecha_de_ingreso");
    const fechaSalida: Date = row.getValue("fecha_de_salida");
    const urgencia: UrgenciaInstrumento = row.getValue("urgencia");

    if (!fechaSalida) return <IndicadorFecha fecha={fechaEntrada} urgencia={urgencia} />
    else return (
        <div className="flex items-center justify-center" title="Notificado">
            <Check size={24} className="text-green-500" />
        </div>
    );
};



export const columnsReporte = (): ColumnDef<InstrumentoExtendido>[] =>
    [

        {
            accessorKey: "juzgado",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Identificador de Juzgado
                    </Button>
                );
            },
            cell: ({ row }) => {
                const juzgado = row.original.orden.juzgado;
                return <span>{juzgado.identifier}</span>;
            },
        },
        {
            accessorKey: "ordenNumber",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Número de Orden
                    </Button>
                );
            },
            cell: ({ row }) => {
                const orden = row.original.orden;
                return <span>{orden.ordenNumber}</span>;
            },
        },
        {
            accessorKey: "domicilio_denunciado",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Domicilio
                    </Button>
                );
            },
        },
        {
            accessorKey: "demora",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Prioridad
                    </Button>
                );
            },
            cell: DemoraCell,

        },
        {
            accessorKey: "fecha_de_ingreso",

        },
        {
            accessorKey: "fecha_de_salida",
        },
        {

            accessorKey: "caratula",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className=" mx-4"
                    >
                        Carátula
                    </Button>
                );
            }
        },
        {
            id: "observaciones",
            accessorKey: "observaciones",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Observaciones
                    </Button>
                );
            },

        },
        {
            accessorKey: "estado",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Estado
                    </Button>
                );
            },
            cell: ({ row }) => {
                const estado = row.original.estado;
                return <span>{estado.replace("_", " ")}</span>;
            }
        },
        {
            accessorKey: "urgencia",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Urgencia
                    </Button>
                );
            },
        },
        {
            id: "acciones",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Acciones
                    </Button>
                );
            },
            cell: ({ row }) => {
                const instrumento = row.original;
                return (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href={`/instrumentos/ver/${instrumento.codigoInstrumento}`} passHref>
                                <Button
                                    className="bg-green-500 hover:bg-green-600"

                                >
                                    <Eye className="h-4 w-4 text-white" />
                                </Button>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Ver mas</p>
                        </TooltipContent>
                    </Tooltip>
                );
            },
        },

    ];