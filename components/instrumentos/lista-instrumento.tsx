"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table"
import { Instrumento } from "@/types/instrumento"

const columns: ColumnDef<Instrumento>[] = [
  {
    accessorKey: "fechaEntrada",
    header: "Fecha de Entrada",
    cell: ({ row }) => {
      const fecha: Date = row.getValue("fechaEntrada")
      return fecha.toLocaleDateString()
    },
  },
  {
    accessorKey: "caratula",
    header: "Carátula",
  },
  {
    accessorKey: "destinatario",
    header: "Destinatario",
  },
]

const data: Instrumento[] = [
    {
      id: "1",
      fechaEntrada: new Date("2023-05-15"),
      caratula: "Caso Pérez vs. González",
      destinatario: "Juzgado Civil N°5",
      direccion: "Av. Corrientes 1234, CABA",
      numeroOrden: "2023-001",
      identificadorJuzgado: "JC-005",
      tipoInstrumento: "Demanda Civil"
    },
    {
      id: "2",
      fechaEntrada: new Date("2023-05-20"),
      caratula: "Sucesión Rodríguez",
      destinatario: "Juzgado de Familia N°3",
      direccion: "Calle Lavalle 2468, CABA",
      numeroOrden: "2023-002",
      identificadorJuzgado: "JF-003",
      tipoInstrumento: "Expediente Sucesorio"
    },
    {
      id: "3",
      fechaEntrada: new Date("2023-05-25"),
      caratula: "Ministerio Público vs. Gómez",
      destinatario: "Tribunal Penal N°2",
      direccion: "Av. de Mayo 5678, CABA",
      numeroOrden: "2023-003",
      identificadorJuzgado: "TP-002",
      tipoInstrumento: "Causa Penal"
    }
  ]

export function ListaInstrumentos() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

