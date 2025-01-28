"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel
} from "@tanstack/react-table";
import { InstrumentoExtendido } from "@/types/instrumentoTypes";
import { columns } from "./col-tabla-instrumento";
import { useState } from "react";
import { SearchX } from "@mynaui/icons-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TablaInstrumentosProps {
  data: InstrumentoExtendido[];
  onEdit: (instrumento: InstrumentoExtendido) => void;
  onDelete: (instrumento: InstrumentoExtendido) => void;
}

export function TablaInstrumentos({ data, onEdit, onDelete }: Readonly<TablaInstrumentosProps>) {

  const [sorting, setSorting] = useState<SortingState>([]);

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
    <div className="overflow-x-auto shadow-lg  w-full rounded-xl items-center border border-gray-200">
      {data.length === 0 ? (
        <div className="flex flex-col w-full justify-center items-center h-64 bg-gray-100 rounded-lg">
          <SearchX className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg font-semibold">No se han encontrado resultados</p>
          <p className="text-gray-400 text-sm">Intenta buscar con otros criterios</p>
        </div>
      ) : (
        <Table className="w-fit text-sm text-gray-700 items-center">
          <TableHeader className="bg-gray-50 border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="text-center">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="p-2 font-semibold text-gray-600 text-center">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-100 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-2 text-center">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
