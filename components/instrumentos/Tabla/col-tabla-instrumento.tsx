import { InstrumentoExtendido } from "@/types/instrumentoTypes";
import { ColumnDef, Row } from "@tanstack/react-table";
import AccionesList from "./acciones-list";
import { Button } from "../../ui/button";
import { parseDate } from "@/lib/utils";
import IndicadorFecha from "./indicador-fecha";
interface ColumnsProps {
    onEdit: (instrumento: InstrumentoExtendido) => void;
    onDelete: (instrumento: InstrumentoExtendido) => void;
}

const FechaEntradaCell = ({ row }: { row: Row<InstrumentoExtendido> }) => {
    const fecha: Date = row.getValue("fecha_de_ingreso");
    if (!fecha) return;
    return <span>{parseDate(fecha.toISOString())}</span>;
};

const FechaSalidaCell = ({ row }: { row: Row<InstrumentoExtendido> }) => {
    const fecha: Date = row.getValue("fecha_de_salida");
    return <span>{
        fecha ? parseDate(fecha.toISOString()) : "No registrada"}
    </span>;
};

const DemoraCell = ({ row }: { row: Row<InstrumentoExtendido> }) => {
const fechaEntrada: Date = row.getValue("fecha_de_ingreso");
const fechaSalida: Date = row.getValue("fecha_de_salida");
if (!fechaSalida) return <IndicadorFecha fecha={fechaEntrada} />
else return <span>Ya entregada</span>



};



export const columns = ({ onEdit, onDelete }: Readonly<ColumnsProps>): ColumnDef<InstrumentoExtendido>[] =>
    [
        {
            accessorKey: "demora",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Demora
                    </Button>
                );
            },
            cell: DemoraCell,

        },
        {
            accessorKey: "fecha_de_ingreso",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Fecha de Ingreso
                    </Button>
                );
            },
            cell: FechaEntradaCell,
        },
        {
            accessorKey: "fecha_de_salida",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Fecha de Salida
                    </Button>
                );
            },
            cell: FechaSalidaCell,
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
            accessorKey: "destinatario",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Destinatario
                    </Button>
                );
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
                        Domicilio Denunciado
                    </Button>
                );
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
            accessorKey: "intrumentoType",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Tipo de Instrumento
                    </Button>
                );
            },
            cell: ({ row }) => {
                const instrumentoType = row.original.instrumentoType;
                return <span>{instrumentoType.name}</span>;
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
                return AccionesList(
                    {
                        Instrumento: instrumento,
                        onEdit,
                        onDelete
                    }
                );
            },
        },
    ];