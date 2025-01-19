"use client";

import { useState } from "react";
import { Trash, Pencil } from "@mynaui/icons-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import { InstrumentoExtendido } from "@/types/instrumento";
import AccionesList from "./acciones-list";
interface TablaInstrumentosProps {
  data: InstrumentoExtendido[];
  onEdit: (instrumento: InstrumentoExtendido) => void;
  onDelete: (id: string) => void;
}

const FechaEntradaCell = ({ row }: { row: any }) => {
  const fecha: Date = row.getValue("entryDate");
  if (!fecha) return;
  return <span>{fecha.toLocaleDateString(
    "es-ES",
    { year: "numeric", month: "2-digit", day: "2-digit" }
  )}</span>;
};

export default function TablaInstrumentos({
  data,
  onEdit,
  onDelete,
}: Readonly<TablaInstrumentosProps>) {
  const [openDelete, setOpenDelete] = useState<string | null>(null);

  const columns: ColumnDef<InstrumentoExtendido>[] = [
    {
      accessorKey: "entryDate",
      header: "Fecha de Entrada",
      cell: FechaEntradaCell,
    },
    { accessorKey: "caratula", header: "Carátula" },
    { accessorKey: "destinatario", header: "Destinatario" },
    { accessorKey: "address", header: "Dirección" },
    { accessorKey: "ordenNumber", header: "Número de Orden" },
    { accessorKey: "juzgado", header: "Identificador de Juzgado",
      cell: ({ row }) => {
        const juzgado = row.original.juzgado;
        return <span>{juzgado.identifier}</span>;
      },

    },
    { accessorKey: "intrumentoType", header: "Tipo de Instrumento",
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

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    data &&
    <div className="overflow-x-auto shadow-lg border border-gray-200 rounded-lg bg-gradient-to-r from-white to-gray-50">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-left">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-2 font-bold">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-gray-50 transition-colors border-b"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
