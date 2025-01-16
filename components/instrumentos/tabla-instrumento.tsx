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
import { Instrumento } from "@/types/instrumento";

interface TablaInstrumentosProps {
  data: Instrumento[];
  onEdit: (instrumento: Instrumento) => void;
  onDelete: (id: string) => void;
}

export default function TablaInstrumentos({
  data,
  onEdit,
  onDelete,
}: Readonly<TablaInstrumentosProps>) {
  const [openDelete, setOpenDelete] = useState<string | null>(null);

  const columns: ColumnDef<Instrumento>[] = [
    {
      accessorKey: "fechaEntrada",
      header: "Fecha de Entrada",
      cell: ({ row }) => {
        const fecha: Date = row.getValue("fechaEntrada");
        return <span>{fecha.toLocaleDateString()}</span>;
      },
    },
    { accessorKey: "caratula", header: "Carátula" },
    { accessorKey: "destinatario", header: "Destinatario" },
    { accessorKey: "direccion", header: "Dirección" },
    { accessorKey: "numeroOrden", header: "Número de Orden" },
    { accessorKey: "identificadorJuzgado", header: "Identificador de Juzgado" },
    { accessorKey: "tipoInstrumento", header: "Tipo de Instrumento" },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => {
        const instrumento = row.original;

        return (
          <div className="flex flex-row gap-4 items-center p-2 w-full h-full">
            {/* Botón Editar */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="bg-blue-500 hover:bg-blue-600"
                  onClick={() => onEdit(instrumento)}
                >
                  <Pencil className="h-4 w-4 text-white" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar</p>
              </TooltipContent>
            </Tooltip>

            {/* Botón Eliminar */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() => setOpenDelete(instrumento.id)}
                >
                  <Trash className="h-4 w-4 text-white" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Eliminar</p>
              </TooltipContent>
            </Tooltip>

            {/* Confirmar Eliminación */}
            {openDelete === instrumento.id && (
              <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <p className="text-lg font-bold">
                    ¿Estás seguro de eliminar este instrumento?
                  </p>
                  <div className="flex gap-4 mt-4">
                    <Button
                      className="bg-red-500 hover:bg-red-600"
                      onClick={() => {
                        onDelete(instrumento.id);
                        setOpenDelete(null);
                      }}
                    >
                      Confirmar
                    </Button>
                    <Button
                      className="bg-gray-500 hover:bg-gray-600"
                      onClick={() => setOpenDelete(null)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
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
