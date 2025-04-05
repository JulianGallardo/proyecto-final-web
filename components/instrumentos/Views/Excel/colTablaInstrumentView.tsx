"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Controller, useFormContext } from "react-hook-form";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import AddressAutocomplete from "@/components/planificador-de-ruta/addresAutoComplete";
import { ExtendedZone } from "@/types/ZoneTypes";
import { DemoraCell } from "../Tabla/col-tabla-instrumento";

interface GetColumnsProps {
    editingIndex: number | null;
    startEditing: (index: number) => void;
    cancelEditing: () => void;
    saveEditedData: () => void;
    onDelete: (instrumento: InstrumentoExtendido) => void;
    Juzgados: JuzgadoDto[];
    instrumentoTypes: InstrumentoTypeDTO[];
    zonas?: ExtendedZone[];
}

export function getColumns({
    editingIndex,
    startEditing,
    cancelEditing,
    saveEditedData,
    onDelete,
    Juzgados,
    instrumentoTypes,
    zonas,
}: GetColumnsProps): ColumnDef<InstrumentoExtendido>[] {
    return [
        {
            header: "Carátula",
            accessorKey: "caratula",
            cell: ({ row }) => {
                const { control } = useFormContext();
                return row.index === editingIndex ? (
                    <Controller name="caratula" control={control} render={({ field }) => <Input {...field} className="text-center" />} />
                ) : (
                    row.original.caratula
                );
            },
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
            cell: ({ row }) => {
                const { control, setValue } = useFormContext();
                return row.index === editingIndex ? (
                    <Controller
                        name="orden.juzgado.identifier"
                        control={control}
                        render={({ field }) => (
                            <Select
                                value={field.value}
                                onValueChange={(value) => {
                                    const juzgado = Juzgados.find((j) => j.identifier === value);
                                    field.onChange(value);
                                    setValue("orden.juzgado.name", juzgado?.name ?? "");
                                }}
                            >
                                <SelectTrigger className="text-center">
                                    <SelectValue placeholder="Seleccionar juzgado" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Juzgados.map((juzgado) => (
                                        <SelectItem key={juzgado.identifier} value={juzgado.identifier}>
                                            {juzgado.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                ) : (
                    row.original.orden.juzgado.name
                );
            },
        },
        {
            header: "Nº de Orden",
            accessorKey: "orden.ordenNumber",
            cell: ({ row }) => row.original.orden.ordenNumber ?? "A calcular",
        },
        {
            header: "Tipo",
            accessorKey: "instrumentoType.name",
            cell: ({ row }) => {
                const { control, setValue } = useFormContext();
                return row.index === editingIndex ? (
                    <Controller
                        name="instrumentoType.identifier"
                        control={control}
                        render={({ field }) => (
                            <Select
                                value={field.value}
                                onValueChange={(value) => {
                                    const tipo = instrumentoTypes.find((t) => t.identifier === value);
                                    field.onChange(value);
                                    setValue("instrumentoType.name", tipo?.name ?? "");
                                }}
                            >
                                <SelectTrigger className="text-center">
                                    <SelectValue placeholder="Seleccionar tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {instrumentoTypes.map((tipo) => (
                                        <SelectItem key={tipo.identifier} value={tipo.identifier}>
                                            {tipo.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                ) : (
                    row.original.instrumentoType.name
                );
            },
        },
        {
            header: "Ingreso",
            accessorKey: "fecha_de_ingreso",
            cell: ({ row }) => {
                const { control } = useFormContext();
                return row.index === editingIndex ? (
                    <Controller
                        name="fecha_de_ingreso"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="date"
                                value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                                onChange={(e) => field.onChange(new Date(e.target.value))}
                            />
                        )}
                    />
                ) : (
                    new Date(row.original.fecha_de_ingreso).toLocaleDateString()
                );
            },
        },
        {
            header: "Descarga",
            accessorKey: "fecha_de_salida",
            cell: ({ row }) => {
                const { control } = useFormContext();
                return row.index === editingIndex ? (
                    <Controller
                        name="fecha_de_salida"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="date"
                                value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                                onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                            />
                        )}
                    />
                ) : row.original.fecha_de_salida ? (
                    new Date(row.original.fecha_de_salida).toLocaleDateString()
                ) : (
                    "N/A"
                );
            },
        },
        {
            header: "Urgencia",
            accessorKey: "urgencia",
            cell: ({ row }) => {
                const { control } = useFormContext();
                return row.index === editingIndex ? (
                    <Controller
                        name="urgencia"
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="text-center">
                                    <SelectValue placeholder="Urgencia" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="NORMAL">Normal</SelectItem>
                                    <SelectItem value="URGENTE">Urgente</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                ) : (
                    row.original.urgencia
                );
            },
        },
        {
            header: "Domicilio",
            cell: ({ row }) => {
                const { setValue } = useFormContext();
                return row.index === editingIndex ? (
                    <AddressAutocomplete
                        defaultValue={row.original.domicilio_denunciado ?? ""}
                        onChange={(value) => setValue("domicilio_denunciado", value)}
                        miUbicacion={false}
                        placeHolder="Buscar domicilio"
                    />
                ) : (
                    row.original.domicilio_denunciado
                );
            },
        },
        {
            header: "Zona",
            cell: ({ row }) => {
                const { control } = useFormContext();
                return row.index === editingIndex ? (
                    <Controller
                        name="zoneName"
                        control={control}
                        render={({ field }) => (
                            <Select
                                value={field.value}
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    
                                }}
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
                        )}
                    />
                ) : (
                    row.original.zoneName ?? "N/A"
                );
            },
        },
        {
            header: "Subzona",
            cell: ({ row }) => {
                const { control, getValues } = useFormContext();
                return row.index === editingIndex ? (
                    <Controller
                        name="subZona"
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="text-center">
                                    <SelectValue placeholder="Seleccionar subZona" />
                                </SelectTrigger>
                                <SelectContent>
                                    {zonas?.find((z) => z.zoneName === getValues("zoneName"))?.SubZonas.map((sub) => (
                                        <SelectItem key={sub.id} value={sub.zoneName}>
                                            {sub.zoneName}
                                        </SelectItem>
                                    ))}
                                    <SelectItem value="automatica">Automática</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                ) : (
                    row.original.subZona ?? "N/A"
                );
            },
        },
        {
            header: "Observaciones",
            accessorKey: "observaciones",
            cell: ({ row }) => {
                const { control } = useFormContext();
                return row.index === editingIndex ? (
                    <Controller
                        name="observaciones"
                        control={control}
                        render={({ field }) => <Input {...field} />}
                    />
                ) : (
                    row.original.observaciones
                );
            },
        },
        {
            header: "Acciones",
            cell: ({ row }) =>
                row.index === editingIndex ? (
                    <div className="flex gap-2 justify-center">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className="bg-green-500 hover:bg-green-600"
                                    onClick={saveEditedData}
                                >
                                    <CheckIcon className="h-4 w-4 text-white" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Guardar cambios</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className="bg-red-500 hover:bg-red-600"
                                    onClick={cancelEditing}
                                >
                                    <XIcon className="h-4 w-4 text-white" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Cancelar</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                ) : (
                    <div className="flex gap-2 justify-center">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className="bg-blue-500 hover:bg-blue-600"
                                    onClick={() => startEditing(row.index)}
                                >
                                    <Edit className="h-4 w-4 text-white" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Editar</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className="bg-red-500 hover:bg-red-600"
                                    onClick={() => onDelete(row.original)}
                                >
                                    <Delete className="h-4 w-4 text-white" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Eliminar</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                ),
        },
    ];
}
