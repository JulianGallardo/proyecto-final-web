"use client";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  RowSelectionState,
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
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";

interface InstrumentoExcelViewProps {
  data: InstrumentoExtendido[];
  saveChanges: (instrumento: InstrumentoDTO) => void;
  onEdit: (instrumento: InstrumentoExtendido) => void;
  onDelete: (instrumento: InstrumentoExtendido) => void;
  onDeleteMultiple?: (instrumentos: InstrumentoExtendido[]) => void;
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
  onDeleteMultiple,
  Juzgados,
  instrumentoTypes,
  zonas,
  onEditDialog,
}: Readonly<InstrumentoExcelViewProps>) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const form = useForm<InstrumentoExtendido>({
    defaultValues: data[editingIndex ?? 0], 
    mode: "onChange",
  });

  useEffect(() => {
    if (editingIndex !== null) {
      form.reset(data[editingIndex]);
    }
  }, [editingIndex]);

  // Reset row selection when data changes
  useEffect(() => {
    setRowSelection({});
  }, [data]);

  const startEditing = useCallback((index: number) => {
    onEdit(data[index]);
    setEditingIndex(index);
  }, [data]);

  const cancelEditing = useCallback(() => {
    setEditingIndex(null);
  }, []);

  const saveEditedData = async () => {
    if (!zonas) return;
    setIsSaving(true);

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
      await saveChanges(instrumentoDto);
    }
    setIsSaving(false);
    cancelEditing();
  };

  // Handle deletion of selected rows
  const handleDeleteSelected = () => {
    if (!onDeleteMultiple) return;
    
    const selectedInstrumentos = Object.keys(rowSelection)
      .map(index => data[parseInt(index)])
      .filter(Boolean);
    
    if (selectedInstrumentos.length > 0) {
      onDeleteMultiple(selectedInstrumentos);
    }
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
      isSaving,
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
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
  });

  // Get the count of selected rows
  const selectedCount = Object.keys(rowSelection).length;

  return (
    <div className="space-y-4 w-full">
      {selectedCount > 0 && onDeleteMultiple && (
        <div className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
          <span>{selectedCount} {selectedCount === 1 ? 'instrumento' : 'instrumentos'} seleccionados</span>
          <Button 
            variant="destructive" 
            onClick={handleDeleteSelected}
            className="bg-red-500 hover:bg-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar seleccionados
          </Button>
        </div>
      )}
      
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
                  <TableRow 
                    key={row.id} 
                    className={`hover:bg-gray-100 transition-colors text-center ${row.getIsSelected() ? 'bg-blue-50' : ''}`}
                    data-state={row.getIsSelected() && "selected"}
                  >
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
    </div>
  );
}
