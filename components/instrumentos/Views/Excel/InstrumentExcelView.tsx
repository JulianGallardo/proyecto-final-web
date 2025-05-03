"use client";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState, useCallback, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { InstrumentoDTO, InstrumentoExtendido, InstrumentoTypeDTO } from "@/types/instrumentoTypes";
import NoResults from "@/components/shared/noResults";
import { getColumns } from "./colTablaInstrumentView";
import { ExtendedZone } from "@/types/ZoneTypes";
import { convertToDto } from "@/lib/utils";
import { FormProvider, useForm } from "react-hook-form";

interface InstrumentoExcelViewProps {
  data: InstrumentoExtendido[];
  saveChanges: (instrumento: InstrumentoDTO) => void;
  onEdit: (instrumento: InstrumentoExtendido) => void;
  onDelete: (instrumento: InstrumentoExtendido) => void;
  Juzgados: JuzgadoDto[];
  instrumentoTypes: InstrumentoTypeDTO[];
  zonas?: ExtendedZone[];
  onEditDialog: (instrumento: InstrumentoExtendido) => void;
}

export default function InstrumentoExcelView({
  data,
  saveChanges,
  onEdit,
  onDelete,
  Juzgados,
  instrumentoTypes,
  zonas,
  onEditDialog,
}: Readonly<InstrumentoExcelViewProps>) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const form = useForm<InstrumentoExtendido>({
    defaultValues: data[editingIndex ?? 0], // lo actualizás dinámicamente abajo
    mode: "onChange",
  });

  useEffect(() => {
    if (editingIndex !== null) {
      form.reset(data[editingIndex]);
    }
  }, [editingIndex]);


  const startEditing = useCallback((index: number) => {
    onEdit(data[index]);
    setEditingIndex(index);
  }, [data]);

  const cancelEditing = useCallback(() => {
    setEditingIndex(null);
  }, []);

  const saveEditedData = () => {
    if (!zonas) return;

    const instrumentoDto = convertToDto(form.getValues(), zonas);

    if (instrumentoDto && data[editingIndex ?? 0]?.domicilio_denunciado !== instrumentoDto.domicilio_denunciado) {
      instrumentoDto.zona = null;
      instrumentoDto.subZona = null;
      instrumentoDto.punto = null;
    }

    if (instrumentoDto && instrumentoDto.subZona === "automatica") {
      instrumentoDto.subZona = null;
    }


    if (instrumentoDto) {
      saveChanges(instrumentoDto);
    }
    cancelEditing();
  };


  const table = useReactTable({
    data,
    columns: getColumns({
      editingIndex: editingIndex ?? -1,
      startEditing,
      cancelEditing,
      saveChanges: saveEditedData,
      onDelete,
      Juzgados,
      instrumentoTypes,
      zonas,
      onEditDialog,

    }),
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      columnVisibility: {
        fecha_de_ingreso: false,
        fecha_de_salida: false,
        estado: false,
        urgencia: false
      }
    },
    state: {
      sorting,
    },
  });

  return (
    <div className="overflow-x-auto shadow-lg w-full rounded-xl border border-gray-200">
      {data.length === 0 ? (
        <NoResults />
      ) : (
        <FormProvider {...form}>
          <Table className="w-full text-sm text-gray-700">
            <TableHeader className="bg-gray-50 border-b">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="text-center">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="w-fit px-3 py-2 text-gray-600 font-semibold text-center">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-100 transition-colors text-center">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-3 py-2 ">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

        </FormProvider>
      )}
    </div>
  );
}
