"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel
} from "@tanstack/react-table";
import { InstrumentoExtendido } from "@/types/instrumento";
import { columns } from "./col-tabla-instrumento";
import { useState } from "react";

interface TablaInstrumentosProps {
  data: InstrumentoExtendido[];
  onEdit: (instrumento: InstrumentoExtendido) => void;
  onDelete: (instrumento: InstrumentoExtendido) => void;
}

export function TablaInstrumentos({ data,onEdit,onDelete }: Readonly<TablaInstrumentosProps>) {

  const [sorting, setSorting] = useState<SortingState>([])


  const tableColumns = columns({ onEdit, onDelete });

  const coreRowModel = getCoreRowModel<InstrumentoExtendido>();

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: coreRowModel,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (

    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="w-full text-sm border-separate border-spacing-0">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-2 font-medium text-gray-700 text-center border-b border-gray-200"
                >
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
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-4 py-2 text-gray-600 text-center border-b border-gray-200"
                >
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
