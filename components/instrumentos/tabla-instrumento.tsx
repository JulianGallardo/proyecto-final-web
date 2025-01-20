"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { InstrumentoExtendido } from "@/types/instrumento";
import { columns } from "./col-tabla-instrumento";
import { TableSkeleton } from "./server-side-table";


interface TablaInstrumentosProps {
  data: InstrumentoExtendido[][];
  onEdit: (instrumento: InstrumentoExtendido) => void;
  onDelete: (id: string) => void;
  loading: boolean;
  currentPage: number;
}


export function TablaInstrumentos({
  onEdit,
  onDelete,
  data,
  loading,
  currentPage,
}: Readonly<TablaInstrumentosProps>) {

  const [openDelete, setOpenDelete] = useState<string | null>(null);

  const tableColumns = columns({ onEdit, onDelete, openDelete, setOpenDelete });

  const dataSelected = data[currentPage-1];

  const table = useReactTable({
    data: dataSelected,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  });




  if (loading){
    return (
      <div className="flex flex-col items-center justify-between h-full w-full p-4 bg-white shadow-sm rounded-lg border border-gray-200">
        <TableSkeleton />
      </div>
    )

  }


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
