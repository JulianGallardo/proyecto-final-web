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
import { CheckIcon, Delete, Edit, Eye, Loader2, MoreVertical, PlusCircle, XIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const CaratulaCell = ({ row, editingIndex }: { row: Row<InstrumentoExtendido>; editingIndex: number }) => {
    const { control } = useFormContext();
    if (row.index !== editingIndex)
        return (
            <div className="flex items-center justify-center">
                <p className="text-xs line-clamp-2 w-fit sm:w-auto max-w-[120px] sm:max-w-[150px] md:max-w-[200px]  lg:max-w-[300px]">{row.original.caratula}</p>
            </div>
        )

    return (
        <Controller
            name="caratula"
            control={control}
            render={({ field }) => (
                <Input
                    {...field}
                    className="h-8 text-xs py-1 px-2 w-full "
                />
            )}
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
    if (row.index !== editingIndex)
        return (
            <div className="flex items-center justify-center">
                <p className="text-xs truncate max-w-[100px] sm:max-w-[120px]">
                    {row.original.orden.juzgado.identifier}
                </p>
            </div>
        );

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
                    <SelectTrigger className="text-xs h-8 px-2 w-full max-w-[120px] sm:max-w-[160px]">
                        <SelectValue placeholder="Juzgado" />
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
    if (row.index !== editingIndex)
        return (
            <div className="text-xs truncate max-w-[100px] sm:max-w-[120px]">
                {row.original.instrumentoType.name}
            </div>
        );

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
                    <SelectTrigger className="text-xs h-8 px-2 w-full max-w-[120px] sm:max-w-[160px]">
                        <SelectValue placeholder="Tipo" />
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
        return (
            <div className="text-xs whitespace-nowrap">
                {new Date(row.original.fecha_de_ingreso).toLocaleDateString()}
            </div>
        );

    return (
        <Controller
            name="fecha_de_ingreso"
            control={control}
            render={({ field }) => (
                <Input
                    type="date"
                    className="text-xs h-8 py-1 px-2 w-full max-w-[120px]"
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
        return (
            <div className="text-xs whitespace-nowrap">
                {row.original.fecha_de_salida
                    ? new Date(row.original.fecha_de_salida).toLocaleDateString()
                    : "N/A"}
            </div>
        );

    return (
        <Controller
            name="fecha_de_salida"
            control={control}
            render={({ field }) => (
                <Input
                    type="date"
                    className="text-xs h-8 py-1 px-2 w-full max-w-[120px]"
                    value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                    onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                />
            )}
        />
    );
};

export const UrgenciaCell = ({ row, editingIndex }: { row: Row<InstrumentoExtendido>; editingIndex: number }) => {
    const { control } = useFormContext();
    if (row.index !== editingIndex)
        return (
            <div className="text-xs">
                {row.original.urgencia}
            </div>
        );

    return (
        <Controller
            name="urgencia"
            control={control}
            render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="text-xs h-8 px-2 w-full max-w-[100px]">
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
        return (
            <div className="w-full justify-center items-center flex">
                <p className="text-xs line-clamp-2 max-w-[120px] sm:max-w-[150px] md:max-w-[200px] ">
                    {row.original.domicilio_denunciado || "N/A"}
                </p>
            </div>
        );

    return (
        <Controller
            name="domicilio_denunciado"
            control={control}
            render={({ field }) => (
                <div className="w-full ">
                    <AddressAutocomplete
                        defaultValue={row.original.domicilio_denunciado ?? ""}
                        onChange={(value) => {
                            field.onChange(value);
                        }}
                        miUbicacion={false}
                        placeHolder="Domicilio"
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

    if (row.index !== editingIndex)
        return (
            <div className="text-xs truncate max-w-[100px]">
                {row.original.zoneName ?? "N/A"}
            </div>
        );

    return (
        <Controller
            name="zoneName"
            control={control}
            render={({ field }) => (
                <Select value={field.value ?? "automatica"} onValueChange={field.onChange} defaultValue="automatica">
                    <SelectTrigger className="text-xs h-8 px-2 w-full max-w-[100px] sm:max-w-[130px]">
                        <SelectValue placeholder="Zona" />
                    </SelectTrigger>
                    <SelectContent>
                        {zonas?.map((zona) => (
                            <SelectItem key={zona.zoneName} value={zona.zoneName}>
                                {zona.zoneName}
                            </SelectItem>
                        ))}
                        <SelectItem value="automatica">Auto</SelectItem>
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
    if (row.index !== editingIndex)
        return (
            <div className=" w-full justify-center items-center flex ">
                <p className="text-xs line-clamp-2 max-w-[120px] sm:max-w-[150px] md:max-w-[200px] ">
                    {row.original.subZona ?? "N/A"}
                </p>
            </div>
        );

    const selectedZone = watch("zoneName");
    const subzonas = zonas?.find((z) => z.zoneName === selectedZone)?.SubZonas || [];

    return (
        <Controller
            name="subZona"
            control={control}
            render={({ field }) => (
                <Select value={field.value ?? "automatica"} onValueChange={field.onChange}>
                    <SelectTrigger className="text-xs h-8 px-2 w-full max-w-[100px] sm:max-w-[130px]">
                        <SelectValue
                            placeholder="SubZona"
                            defaultValue={field.value}
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {subzonas.map((sub) => (
                            <SelectItem key={sub.id} value={sub.zoneName}>
                                {sub.zoneName.replace(/_/g, " ")}
                            </SelectItem>
                        ))}
                        <SelectItem value="automatica">Auto</SelectItem>
                        <SelectItem value="Sin_SubZona">Sin Sub</SelectItem>
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
            <div className="w-full">
                <p className="text-xs line-clamp-2 max-w-[120px] sm:max-w-[150px]">
                    {row.original.observaciones ?? "N/A"}
                </p>
            </div>
        );

    return (
        <Controller
            name="observaciones"
            control={control}
            render={({ field }) => (
                <Input
                    {...field}
                    className="text-xs h-8 py-1 px-2 w-full max-w-[120px] sm:max-w-[150px]"
                />
            )}
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
    isSaving,
}: {
    row: Row<InstrumentoExtendido>;
    editingIndex: number;
    onDelete: (instrumento: InstrumentoExtendido) => void;
    startEditing: (index: number) => void;
    saveChanges: () => void;
    cancelEditing: () => void;
    onEditDialog: (instrumento: InstrumentoExtendido) => void;
    isSaving: boolean;
}) => {
    const router = useRouter();
    const isEditing = row.index === editingIndex;

    if (isEditing) {
        return (
            <div className="flex gap-1 justify-center">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 p-0 h-10 w-6"
                            onClick={saveChanges}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                                <CheckIcon className="h-3 w-3 text-white" />
                            )}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="text-xs">Guardar</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 p-0 h-10 w-6"
                            onClick={cancelEditing}
                            disabled={isSaving}
                        >
                            <XIcon className="h-3 w-3 text-white" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="text-xs">Cancelar</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="sm"
                            className="bg-yellow-500 hover:bg-yellow-600 p-0 h-10 w-6"
                            onClick={() => onEditDialog(row.original)}
                            disabled={isSaving}
                        >
                            <PlusCircle className="h-3 w-3 text-white" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="text-xs">Más opciones</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        );
    }

    return (
        <div className="flex justify-center">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-7 w-7 p-0">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                    <DropdownMenuItem
                        onClick={() =>
                            router.push(`/instrumentos/ver/${row.original.codigoInstrumento}`)
                        }
                        className="text-xs py-1.5"
                    >
                        <Eye className="h-3 w-3 mr-2" /> Ver más
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => startEditing(row.index)}
                        className="text-xs py-1.5"
                    >
                        <Edit className="h-3 w-3 mr-2" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => onDelete(row.original)}
                        className="text-red-600 text-xs py-1.5"
                    >
                        <Delete className="h-3 w-3 mr-2" /> Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};