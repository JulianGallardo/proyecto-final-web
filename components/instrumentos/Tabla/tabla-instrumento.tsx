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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import NoResults from "@/components/shared/noResults";
import { EstadoInstrumento } from "@prisma/client";

interface TablaInstrumentosProps {
  data: InstrumentoExtendido[];
  onEdit: (instrumento: InstrumentoExtendido) => void;
  onDelete: (instrumento: InstrumentoExtendido) => void;
}

function getRowColor(instrumento: InstrumentoExtendido) {
  switch (instrumento.estado) {
    case EstadoInstrumento.CORRECCIONES_SOLICITADAS:
      return "bg-red-50";
    case EstadoInstrumento.NOTIFICADO_VERDE:
    case EstadoInstrumento.NOTIFICADO_AMARILLO:
    case EstadoInstrumento.NOTIFICADO_ROJO:
      return "bg-gray-50";
    default:
      return "";
  }
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
    initialState:{
      columnVisibility:{
        fecha_de_ingreso: false,
        fecha_de_salida: false,
        estado: false,
      }
    },
    state: {
      sorting,
    },
  });

  return (
    <div className="overflow-x-auto shadow-lg  w-full rounded-xl items-center border border-gray-200">
      {data.length === 0 ? (
        <NoResults />
      ) : (
        <Table className="w-full text-sm text-gray-700 items-center">
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
                <TableRow key={row.id} className={"hover:bg-gray-100 transition-colors " + getRowColor(row.original)}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className=" p-2 text-center">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
