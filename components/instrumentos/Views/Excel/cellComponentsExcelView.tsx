import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import AddressAutocomplete from "@/components/planificador-de-ruta/addressAutoComplete";
import { InstrumentoExtendido, InstrumentoTypeDTO } from "@/types/instrumentoTypes";

import { ExtendedZone } from "@/types/ZoneTypes";
import { Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { CheckIcon, Delete, Edit, Eye, MoreVertical, PlusCircle, XIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const CaratulaCell = ({ row, editingIndex }: { row: Row<InstrumentoExtendido>; editingIndex: number }) => {
    const { control } = useFormContext();
    if (row.index !== editingIndex)
        return (
            <div className="flex items-center justify-center  ">
                <p className="max-w-52 text-xs whitespace-normal">{row.original.caratula}</p>
            </div>
        )

    return (
        <Controller
            name="caratula"
            control={control}
            render={({ field }) => <Input {...field} className=" h-full text-xs flex items-center justify-center p-2" />}
        />
    );
};
export const JuzgadoCell = ({
    row,
    editingIndex,
    Juzgados,
}: {
    row: Row<InstrumentoExtendido>;
    editingIndex: number;
    Juzgados: JuzgadoDto[];
}) => {
    const { control, setValue } = useFormContext();
    if (row.index !== editingIndex) return row.original.orden.juzgado.identifier;

    return (
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
                                {juzgado.identifier}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        />
    );
};

export const TipoCell = ({
    row,
    editingIndex,
    instrumentoTypes,
}: {
    row: Row<InstrumentoExtendido>;
    editingIndex: number;
    instrumentoTypes: InstrumentoTypeDTO[];
}) => {
    const { control, setValue } = useFormContext();
    if (row.index !== editingIndex) return row.original.instrumentoType.name;

    return (
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
    );
};

export const IngresoCell = ({ row, editingIndex }: { row: Row<InstrumentoExtendido>; editingIndex: number }) => {
    const { control } = useFormContext();
    if (row.index !== editingIndex)
        return new Date(row.original.fecha_de_ingreso).toLocaleDateString();

    return (
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
    );
};

export const DescargaCell = ({ row, editingIndex }: { row: Row<InstrumentoExtendido>; editingIndex: number }) => {
    const { control } = useFormContext();
    if (row.index !== editingIndex)
        return row.original.fecha_de_salida
            ? new Date(row.original.fecha_de_salida).toLocaleDateString()
            : "N/A";

    return (
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
    );
};

export const UrgenciaCell = ({ row, editingIndex }: { row: Row<InstrumentoExtendido>; editingIndex: number }) => {
    const { control } = useFormContext();
    if (row.index !== editingIndex) return row.original.urgencia;

    return (
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
    );
};

export const DomicilioCell = ({ row, editingIndex }: { row: Row<InstrumentoExtendido>; editingIndex: number }) => {
    const { control } = useFormContext();



    if (row.index !== editingIndex)
        return <p className="min-w-52 text-xs whitespace-normal">
            {
                row.original.domicilio_denunciado?.length > 30
                    ? row.original.domicilio_denunciado.slice(0, 30) + "..."
                    : row.original.domicilio_denunciado
            }</p>




    return (
        <Controller
            name="domicilio_denunciado"
            control={control}
            render={({ field }) => (
                <div className="min-w-52">
                    <AddressAutocomplete
                        defaultValue={row.original.domicilio_denunciado ?? ""}
                        onChange={(value) => {
                            field.onChange(value);


                        }}
                        miUbicacion={false}
                        placeHolder="Buscar domicilio"
                    />
                </div>
            )}
        />

    );
};

export const ZonaCell = ({
    row,
    editingIndex,
    zonas,
}: {
    row: Row<InstrumentoExtendido>;
    editingIndex: number;
    zonas?: ExtendedZone[];
}) => {
    const { control } = useFormContext();



    if (row.index !== editingIndex) return row.original.zoneName ?? "N/A";


    return (
        <Controller
            name="zoneName"
            control={control}
            render={({ field }) => (
                <Select value={field.value ?? "automatica"} onValueChange={field.onChange} defaultValue="automatica">
                    <SelectTrigger className="text-center">
                        <SelectValue placeholder="Seleccionar zona" />
                    </SelectTrigger>
                    <SelectContent>
                        {zonas?.map((zona) => (
                            <SelectItem key={zona.zoneName} value={zona.zoneName}>
                                {zona.zoneName}
                            </SelectItem>
                        ))}
                        <SelectItem value="automatica">Automática</SelectItem>
                    </SelectContent>
                </Select>
            )}
        />
    );
};

export const SubZonaCell = ({
    row,
    editingIndex,
    zonas,
}: {
    row: Row<InstrumentoExtendido>;
    editingIndex: number;
    zonas?: ExtendedZone[];
}) => {
    const { control, watch } = useFormContext();
    if (row.index !== editingIndex) return row.original.subZona ?? "N/A";

    const selectedZone = watch("zoneName");
    const subzonas = zonas?.find((z) => z.zoneName === selectedZone)?.SubZonas || [];




    return (
        <Controller
            name="subZona"
            control={control}
            render={({ field }) => (
                <Select value={field.value ?? "automatica"} onValueChange={field.onChange}>
                    <SelectTrigger className="text-center">
                        <SelectValue
                            placeholder="Seleccionar subZona"
                            defaultValue={field.value}
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {subzonas.map((sub) => (
                            <SelectItem key={sub.id} value={sub.zoneName}>
                                {sub.zoneName.replace(/_/g, " ")}
                            </SelectItem>
                        ))}
                        <SelectItem value="automatica">Automática</SelectItem>
                        <SelectItem value="Sin_SubZona">Sin Subzona</SelectItem>
                    </SelectContent>
                </Select>
            )}
        />
    );
};



export const ObservacionesCell = ({ row, editingIndex }: { row: Row<InstrumentoExtendido>; editingIndex: number }) => {
    const { control } = useFormContext();
    if (row.index !== editingIndex)
        return (
            <div className="flex items-center justify-center truncate  ">
                <p className=" text-xs min-w-28 whitespace-normal">{row.original.observaciones}</p>
            </div>
        );

    return (
        <Controller
            name="observaciones"
            control={control}
            render={({ field }) => <Input className="min-w-50" {...field} />}
        />
    );
};

export const AccionesCell = ({
    row,
    editingIndex,
    onDelete,
    startEditing,
    saveChanges,
    cancelEditing,
    onEditDialog,
}: {
    row: Row<InstrumentoExtendido>;
    editingIndex: number;
    onDelete: (instrumento: InstrumentoExtendido) => void;
    startEditing: (index: number) => void;
    saveChanges: () => void;
    cancelEditing: () => void;
    onEditDialog: (instrumento: InstrumentoExtendido) => void;
}) => {
    const router = useRouter();
    const isEditing = row.index === editingIndex;

    if (isEditing) {
        return (
            <div className="flex gap-1 justify-center flex-wrap md:flex-nowrap">
                

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 p-1"
                            onClick={saveChanges}
                        >
                            <CheckIcon className="h-3 w-3 text-white" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Guardar cambios</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 p-1"
                            onClick={cancelEditing}
                        >
                            <XIcon className="h-3 w-3 text-white" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Cancelar</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="sm"
                            className="bg-yellow-500 hover:bg-yellow-600 p-1"
                            onClick={() => onEditDialog(row.original)}
                        >
                            <PlusCircle className="h-3 w-3 text-white" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Más Opciones</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        );
    }

    return (
        <div className="flex justify-center">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="p-2">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={() =>
                            router.push(`/instrumentos/ver/${row.original.codigoInstrumento}`)
                        }
                    >
                        <Eye className="h-4 w-4 mr-2" /> Ver más
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => startEditing(row.index)}>
                        <Edit className="h-4 w-4 mr-2" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => onDelete(row.original)}
                        className="text-red-600"
                    >
                        <Delete className="h-4 w-4 mr-2" /> Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};