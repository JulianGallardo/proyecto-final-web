import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import AddressAutocomplete from "@/components/planificador-de-ruta/addresAutoComplete";
import { InstrumentoExtendido, InstrumentoTypeDTO } from "@/types/instrumentoTypes";

import { ExtendedZone } from "@/types/ZoneTypes";
import { Row } from "@tanstack/react-table";


export const CaratulaCell = ({ row, editingIndex }: { row: Row<InstrumentoExtendido>; editingIndex: number }) => {
    const { control } = useFormContext();
    if (row.index !== editingIndex) return row.original.caratula;

    return (
        <Controller
            name="caratula"
            control={control}
            render={({ field }) => <Input {...field} className="text-center" />}
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
    if (row.index !== editingIndex) return row.original.orden.juzgado.name;

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
                                {juzgado.name}
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
    const { setValue } = useFormContext();
    if (row.index !== editingIndex) return row.original.domicilio_denunciado;

    return (
        <div className="min-w-80">
            <AddressAutocomplete
                defaultValue={row.original.domicilio_denunciado ?? ""}
                onChange={(value) => setValue("domicilio_denunciado", value)}
                miUbicacion={false}
                placeHolder="Buscar domicilio"
            />
        </div >
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
    if (row.index !== editingIndex) return row.original.observaciones;

    return (
        <Controller
            name="observaciones"
            control={control}
            render={({ field }) => <Input className="min-w-80" {...field} />}
        />
    );
};
