// components/tabla/col-tabla-instrumento.ts

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InstrumentoExtendido, InstrumentoTypeDTO } from "@/types/instrumentoTypes";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CheckIcon, XIcon, Edit, Trash2 as Delete } from "lucide-react";
import { DemoraCell } from "../Tabla/col-tabla-instrumento";
import { ExtendedZone } from "@/types/ZoneTypes";
import { useState } from "react";

interface GetColumnsProps {
    editingIndex: number | null;
    editedData: InstrumentoExtendido | null;
    startEditing: (index: number) => void;
    cancelEditing: () => void;
    saveEditedData: () => void;
    handleInputChange: (field: keyof InstrumentoExtendido, value: any) => void;
    onDelete: (instrumento: InstrumentoExtendido) => void;
    Juzgados: JuzgadoDto[];
    instrumentoTypes: InstrumentoTypeDTO[];
    zonas?: ExtendedZone[];
}

export function getColumns({
    editingIndex,
    editedData,
    startEditing,
    cancelEditing,
    saveEditedData,
    handleInputChange,
    onDelete,
    Juzgados,
    instrumentoTypes,
    zonas
}: GetColumnsProps): ColumnDef<InstrumentoExtendido>[] {


    const [selectedZone, setSelectedZone] = useState<ExtendedZone | null>(null);
    const [selectedJuzgado, setSelectedJuzgado] = useState<JuzgadoDto | null>(null);

    return [
        {
            header: "Carátula",
            accessorKey: "caratula",
            cell: ({ row }) =>
                row.index === editingIndex ? (
                    <Input
                        value={editedData?.caratula ?? ""}
                        onChange={(e) => handleInputChange("caratula", e.target.value)}
                        className="text-center"
                    />
                ) : (
                    row.original.caratula
                ),
        },
        {
            header: "Código",
            accessorKey: "codigoInstrumento",
        },
        {
            header: "Prioridad",
            accessorKey: "prioridad",
            cell: DemoraCell,
        },
        {
            header: "Juzgado",
            accessorKey: "orden.juzgado.name",
            cell: ({ row }) =>
                row.index === editingIndex ? (
                    <Select
                        value={editedData?.orden.juzgado.identifier}
                        onValueChange={(value) => {
                            setSelectedJuzgado(Juzgados.find((juzgado) => juzgado.identifier === value) ?? null);
                            handleInputChange("orden", {
                                ...editedData!.orden,
                                juzgado: { identifier: value, name: "" },
                            });}

                        }
                    >
                        <SelectTrigger className="text-center">
                            <SelectValue placeholder="Seleccionar juzgado" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                Juzgados.map((juzgado) => (
                                    <SelectItem key={juzgado.identifier} value={juzgado.identifier}>
                                        {juzgado.name}
                                    </SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                ) : (
                    row.original.orden.juzgado.name
                ),
        },
        {
            header: "Nº de Orden",
            accessorKey: "orden.ordenNumber",
            cell: ({ row }) => row.original.orden.juzgado.identifier === selectedJuzgado?.identifier ? (
                row.original.orden.ordenNumber
            ) : (
                "A calcular"
            )
        },
        {
            header: "Tipo",
            accessorKey: "instrumentoType.name",
            cell: ({ row }) =>
                row.index === editingIndex ? (
                    <Select
                        value={editedData?.instrumentoType.identifier}
                        onValueChange={(value) =>
                            handleInputChange("instrumentoType", {
                                ...editedData!.instrumentoType,
                                identifier: value,
                            })
                        }
                    >
                        <SelectTrigger className="text-center">
                            <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                instrumentoTypes.map((tipo) => (
                                    <SelectItem key={tipo.identifier} value={tipo.identifier}>
                                        {tipo.name}
                                    </SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                ) : (
                    row.original.instrumentoType.name
                ),
        },
        {
            header: "Ingreso",
            accessorKey: "fecha_de_ingreso",
            cell: ({ row }) =>
                row.index === editingIndex ? (
                    <Input
                        type="date"
                        value={
                            editedData?.fecha_de_ingreso
                                ? new Date(editedData.fecha_de_ingreso).toISOString().split("T")[0]
                                : ""
                        }
                        onChange={(e) =>
                            handleInputChange("fecha_de_ingreso", new Date(e.target.value))
                        }
                    />
                ) : (
                    new Date(row.original.fecha_de_ingreso).toLocaleDateString()
                ),
        },
        {
            header: "Descarga",
            accessorKey: "fecha_de_salida",
            cell: ({ row }) =>
                row.index === editingIndex ? (
                    <Input
                        type="date"
                        value={
                            editedData?.fecha_de_salida
                                ? new Date(editedData.fecha_de_salida).toISOString().split("T")[0]
                                : ""
                        }
                        onChange={(e) =>
                            handleInputChange(
                                "fecha_de_salida",
                                e.target.value ? new Date(e.target.value) : null
                            )
                        }
                    />
                ) : row.original.fecha_de_salida ? (
                    new Date(row.original.fecha_de_salida).toLocaleDateString()
                ) : (
                    "N/A"
                ),
        },
        {
            header: "Urgencia",
            accessorKey: "urgencia",
            cell: ({ row }) =>
                row.index === editingIndex ? (
                    <Select
                        value={editedData?.urgencia}
                        onValueChange={(value) => handleInputChange("urgencia", value)}
                    >
                        <SelectTrigger className="text-center">
                            <SelectValue placeholder="Urgencia" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="NORMAL">Normal</SelectItem>
                            <SelectItem value="URGENTE">Urgente</SelectItem>
                        </SelectContent>
                    </Select>
                ) : (
                    row.original.urgencia
                ),
        },
        {
            header: "Domicilio",
            accessorKey: "domicilio_denunciado",
            cell: ({ row }) =>
                row.index === editingIndex ? (
                    <Input
                        value={editedData?.domicilio_denunciado || ""}
                        onChange={(e) =>
                            handleInputChange("domicilio_denunciado", e.target.value)
                        }
                    />
                ) : (
                    row.original.domicilio_denunciado
                ),
        },
        {
            header: "Zona",
            cell: ({ row }) =>
                row.index === editingIndex ? (
                    <Select
                        value={editedData?.zoneName ?? undefined}
                        onValueChange={(value) => {
                            const zona= zonas?.find((zona) => zona.zoneName === value)
                            console.log(zona)
                            handleInputChange("zoneName", zona?.zoneName);
                            setSelectedZone(zona ?? null);
                        }


                        }
                    >
                        <SelectTrigger className="text-center">
                            <SelectValue placeholder="Seleccionar zona" />
                        </SelectTrigger>
                        <SelectContent>
                            {zonas?.map((zona) => (
                                <SelectItem key={zona.zoneName} value={zona.zoneName}>
                                    {zona.zoneName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ) : (
                    row.original.zoneName ?? "N/A"
                ),
        },
        {
            header: "Subzona",
            cell: ({ row }) =>
                row.index === editingIndex ? (
                    <Select
                        value={editedData?.subZona ?? undefined}
                        onValueChange={(value) => {
                            handleInputChange("subZona", value);
                        }

                        }
                    >
                        <SelectTrigger className="text-center">
                            <SelectValue placeholder="Seleccionar subZona" />
                        </SelectTrigger>
                        <SelectContent>
                            {selectedZone?.SubZonas.map((subZona) => (
                                <SelectItem key={subZona.id} value={subZona.zoneName}>
                                    {subZona.zoneName}
                                </SelectItem>
                            ))}
                            <SelectItem value="automatica">Automática</SelectItem>
                        </SelectContent>
                    </Select>
                ) : (
                    row.original.subZona || "N/A"
                ),

        },
        {
            header: "Observaciones",
            accessorKey: "observaciones",
            cell: ({ row }) =>
                row.index === editingIndex ? (
                    <Input
                        value={editedData?.observaciones || ""}
                        onChange={(e) =>
                            handleInputChange("observaciones", e.target.value)
                        }
                    />
                ) : (
                    row.original.observaciones || "N/A"
                ),
        },
        {
            header: "Acciones",
            cell: ({ row }) =>
                row.index === editingIndex ? (
                    <div className="flex gap-2 justify-center">
                        <Button onClick={saveEditedData}>
                            <CheckIcon className="h-4 w-4" />
                        </Button>
                        <Button onClick={cancelEditing}>
                            <XIcon className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex gap-2 justify-center">
                        <Button onClick={() => startEditing(row.index)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => onDelete(row.original)}>
                            <Delete className="h-4 w-4" />
                        </Button>
                    </div>
                ),
        },
    ];
}
