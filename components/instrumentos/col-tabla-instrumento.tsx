import { InstrumentoExtendido } from "@/types/instrumento";
import { ColumnDef } from "@tanstack/react-table";
import AccionesList from "./acciones-list";



interface ColumnsProps {
    onEdit: (instrumento: InstrumentoExtendido) => void;
    onDelete: (id: string) => void;
    openDelete: string | null;
    setOpenDelete: (id: string | null) => void;
}



const FechaEntradaCell = ({ row }: { row: any }) => {
    const fecha: Date = row.getValue("entryDate");
    if (!fecha) return;
    return <span>{fecha.toLocaleDateString(
        "es-ES",
        { year: "numeric", month: "2-digit", day: "2-digit" }
    )}</span>;
};

const FechaSalidaCell = ({ row }: { row: any }) => {
    const fecha: Date = row.getValue("exitDate");
    if (!fecha) return;
    return <span>{fecha.toLocaleDateString(
        "es-ES",
        { year: "numeric", month: "2-digit", day: "2-digit" }
    )}</span>;
};



export const columns = ({ onEdit, onDelete, openDelete, setOpenDelete }: ColumnsProps): ColumnDef<InstrumentoExtendido>[] => 
    
    

[

    {
        accessorKey: "entryDate",
        header: "Fecha de Entrada",
        cell: FechaSalidaCell,
    },
    {
        accessorKey: "exitDate",
        header: "Fecha de Salida",
        cell: FechaEntradaCell,
    },
    { accessorKey: "caratula", header: "Carátula" },
    { accessorKey: "destinatario", header: "Destinatario" },
    { accessorKey: "address", header: "Dirección" },
    { accessorKey: "ordenNumber", header: "Número de Orden" },
    {
        accessorKey: "juzgado", header: "Identificador de Juzgado",
        cell: ({ row }) => {
            const juzgado = row.original.juzgado;
            return <span>{juzgado.identifier}</span>;
        },

    },
    {
        accessorKey: "intrumentoType", header: "Tipo de Instrumento",
        cell: ({ row }) => {
            const instrumentoType = row.original.instrumentoType;
            return <span>{instrumentoType.name}</span>;
        },
    },
    {
        id: "acciones",
        header: "Acciones",
        cell: ({ row }) => {
            const instrumento = row.original;
            return AccionesList({
                onEdit,
                onDelete,
                instrumento,
                openDelete,
                setOpenDelete,
            });

        },
    },
  ];