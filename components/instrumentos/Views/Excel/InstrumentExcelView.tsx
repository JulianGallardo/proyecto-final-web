"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CheckIcon, XIcon, Edit, Trash2 } from "lucide-react";
import { InstrumentoExtendido } from "@/types/instrumentoTypes";
import NoResults from "@/components/shared/noResults";
import { getColumns } from "./colTablaInstrumentView";

interface InstrumentoExcelViewProps {
  data: InstrumentoExtendido[];
  onEdit: (instrumento: InstrumentoExtendido) => void;
  onDelete: (instrumento: InstrumentoExtendido) => void;
}

export default function InstrumentoExcelView({
  data,
  onEdit,
  onDelete,
}: InstrumentoExcelViewProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<InstrumentoExtendido | null>(null);

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditedData({ ...data[index] });
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditedData(null);
  };

  const saveEditedData = () => {
    if (editedData) onEdit(editedData);
    cancelEditing();
  };

  const handleInputChange = (field: keyof InstrumentoExtendido, value: any) => {
    if (editedData) {
      setEditedData({ ...editedData, [field]: value });
    }
  };

  const table = useReactTable({
    data,
    columns:getColumns({
      editingIndex,
      editedData,
      startEditing,
      cancelEditing,
      saveEditedData,
      handleInputChange,
      onDelete,
    }),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto shadow-lg w-full rounded-xl border border-gray-200">
      {data.length === 0 ? (
        <NoResults />
      ) : (
        <Table className="w-full text-sm text-gray-700">
          <TableHeader className="bg-gray-50 border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="text-center">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-3 py-2 text-gray-600 font-semibold text-center">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="hover:bg-gray-100 transition-colors text-center"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-3 py-2 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
