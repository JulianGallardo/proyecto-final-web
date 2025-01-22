import { InstrumentoExtendido } from "@/types/instrumento";
import { ColumnDef, Row } from "@tanstack/react-table";
import AccionesList from "./acciones-list";
import { Button } from "../../ui/button";
interface ColumnsProps {
    onEdit: (instrumento: InstrumentoExtendido) => void;
    onDelete: (instrumento: InstrumentoExtendido) => void;
}

const FechaEntradaCell = ({ row }: { row: Row<InstrumentoExtendido> }) => {
    const fecha: Date = row.getValue("entryDate");
    if (!fecha) return;
    return <span>{fecha.toLocaleDateString(
        "es-ES",
        { year: "numeric", month: "2-digit", day: "2-digit" }
    )}</span>;
};

const FechaSalidaCell = ({ row }: { row: Row<InstrumentoExtendido> }) => {
    const fecha: Date = row.getValue("exitDate");
    return <span>{

        fecha ?
            fecha.toLocaleDateString(
                "es-ES",
                { year: "numeric", month: "2-digit", day: "2-digit" }) : "No registrada"
    }
    </span>;
};



export const columns = ({ onEdit, onDelete }: Readonly<ColumnsProps>): ColumnDef<InstrumentoExtendido>[] =>
    [

        {
            accessorKey: "entryDate",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Fecha de Entrada
                    </Button>
                );
            },
            cell: FechaEntradaCell,
        },
        {
            accessorKey: "exitDate",
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
                    >
                        Carátula
                    </Button>
                );
            },
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
            accessorKey: "address",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Dirección
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
                const juzgado = row.original.juzgado;
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