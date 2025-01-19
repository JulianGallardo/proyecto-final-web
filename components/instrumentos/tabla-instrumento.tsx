"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { InstrumentoExtendido } from "@/types/instrumento";
import { columns } from "./col-tabla-instrumento";
interface TablaInstrumentosProps {
  data: InstrumentoExtendido[];
  onEdit: (instrumento: InstrumentoExtendido) => void;
  onDelete: (id: string) => void;
}


export default function TablaInstrumentos({
  data,
  onEdit,
  onDelete,
}: Readonly<TablaInstrumentosProps>) {
  const [openDelete, setOpenDelete] = useState<string | null>(null);

  const tableColumns = columns({ onEdit, onDelete, openDelete, setOpenDelete }); 

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
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
