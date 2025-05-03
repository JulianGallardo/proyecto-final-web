import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { InstrumentoExtendido, InstrumentoTypeDTO } from "@/types/instrumentoTypes";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ExtendedZone } from "@/types/ZoneTypes";
import { DemoraCell } from "../Tabla/col-tabla-instrumento";

import {
  CaratulaCell,
  JuzgadoCell,
  DomicilioCell,
  ZonaCell,
  SubZonaCell,
  AccionesCell,
} from "./cellComponentsExcelView";

interface GetColumnsProps {
  editingIndex: number;
  startEditing: (index: number) => void;
  cancelEditing: () => void;
  saveChanges: () => void;
  onDelete: (instrumento: InstrumentoExtendido) => void;
  Juzgados: JuzgadoDto[];
  instrumentoTypes: InstrumentoTypeDTO[];
  zonas?: ExtendedZone[];
  onEditDialog: (instrumento: InstrumentoExtendido) => void;
  isSaving?: boolean;
}

export function getColumns({
  editingIndex,
  startEditing,
  cancelEditing,
  saveChanges,
  onDelete,
  Juzgados,
  zonas,
  onEditDialog,
  isSaving = false,
}: GetColumnsProps): ColumnDef<InstrumentoExtendido>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "demora",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Prioridad
          </Button>
        );
      },
      cell: DemoraCell,
    },
    {
      accessorKey: "fecha_de_ingreso",
    },
    {
      accessorKey: "fecha_de_salida",
    },
    {
      accessorKey: "urgencia",
    },
    {
      accessorKey: "caratula",
      header: "Carátula",
      cell: ({ row }) => <CaratulaCell row={row} editingIndex={editingIndex} />,
    },
    {
      accessorKey: "codigoInstrumento",
      header: "Codigo",
      cell: ({ row }) => <p>{row.original.codigoInstrumento}</p>,
    },
    {
      accessorKey: "orden.juzgado",
      header: "Juzgado",
      cell: ({ row }) => (
        <JuzgadoCell row={row} editingIndex={editingIndex} Juzgados={Juzgados} />
      ),
    },
    {
      accessorKey: "N ° de orden",
      header: "N°",
      cell: ({ row }) => <p>{row.original.orden.ordenNumber}</p>,
    },
    {
      accessorKey: "domicilio_denunciado",
      header: "Domicilio",
      cell: ({ row }) => <DomicilioCell row={row} editingIndex={editingIndex} />,
    },
    {
      accessorKey: "zoneName",
      header: "Zona",
      cell: ({ row }) => <ZonaCell row={row} editingIndex={editingIndex} zonas={zonas} />,
    },
    {
      accessorKey: "subZona",
      header: "SubZona",
      cell: ({ row }) => (
        <SubZonaCell row={row} editingIndex={editingIndex} zonas={zonas} />
      ),
    },
    {
      accessorKey: "acciones",
      header: "Acciones",
      cell: ({ row }) => {
        const index = row.index;
        const isEditing = index === editingIndex;

        if (isEditing) {
          return (
            <div className="flex space-x-2">
              <Button
                onClick={saveChanges}
                className="bg-green-500 hover:bg-green-600"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar"
                )}
              </Button>
              <Button onClick={cancelEditing} disabled={isSaving}>
                Cancelar
              </Button>
            </div>
          );
        }

        return (
          <AccionesCell
            row={row}
            editingIndex={editingIndex}
            startEditing={startEditing}
            cancelEditing={cancelEditing}
            saveChanges={saveChanges}
            onDelete={onDelete}
            onEditDialog={onEditDialog}
          />
        );
      },
    },
  ];
}
