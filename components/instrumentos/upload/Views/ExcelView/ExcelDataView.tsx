import AddressAutocomplete from "@/components/planificador-de-ruta/addressAutoComplete";
import { Button } from "@/components/ui/button";
import { InstrumentoDTO } from "@/types/instrumentoTypes";
import { Juzgado, InstrumentoType, UrgenciaInstrumento } from "@prisma/client";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CheckIcon, XIcon, Edit, Delete } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { ExtendedZone } from "@/types/ZoneTypes";
import { getSubzoneInCoords, getZoneInCoords } from "@/lib/locationUtils/zoneUtils";

interface ExcelDataViewProps {
    juzgados: Juzgado[];
    data: InstrumentoDTO[];
    onCancelarCarga: (error: InstrumentoDTO) => void;
    instrumentoTypes: InstrumentoType[];
    editingIndex: number | null;
    editedData: InstrumentoDTO | null;
    startEditing: (index: number) => void;
    handleInputChange: (field: keyof InstrumentoDTO, value: any) => void; // eslint-disable-line
    saveEditedData: () => void;
    cancelEditing: () => void;
    zonas: ExtendedZone[];
    onEditDialog: (instrumento: InstrumentoDTO) => void;
}

export default function ExcelDataView({
    data,
    onCancelarCarga,
    juzgados,
    instrumentoTypes,
    editingIndex,
    editedData,
    startEditing,
    handleInputChange,
    saveEditedData,
    cancelEditing,
    zonas,
    onEditDialog
}: Readonly<ExcelDataViewProps>) {
    // Estado para la celda específica que se está editando
    const [editingCell, setEditingCell] = useState<{
        index: number | null,
        field: keyof InstrumentoDTO | null
    }>({ index: null, field: null });

    // Effect to update zone and subzone when address changes
    useEffect(() => {
        if (editedData?.punto && (editedData.zona?.zoneName === "automatica" || !editedData.zona)) {
            // Get the zone based on coordinates
            getZoneInCoords(editedData.punto[0], editedData.punto[1]).then((automaticZone) => {
                if (automaticZone) {
                    const foundZone = zonas.find(z => z.zoneName === automaticZone.zone?.zoneName);
                    handleInputChange('zona', foundZone);

                    // Get subzone if zone exists
                    if (foundZone?.id) {
                        getSubzoneInCoords(
                            editedData.punto?.[0] ?? 0,
                            editedData.punto?.[1] ?? 0,
                            foundZone.id
                        ).then(subzone => {
                            if (subzone) {
                                handleInputChange('subZona', subzone.subzone);
                            }
                        });
                    }
                }
            });
        }
    }, [editedData?.punto, editedData?.domicilio_denunciado]);

    // Campos que pueden ser editados con doble clic
    const editableFields: Array<keyof InstrumentoDTO> = [
        'caratula',
        'juzgadoIdentifier',
        'instrumentoTypeIdentifier',
        'fecha_de_ingreso',
        'urgencia',
        'domicilio_denunciado',
        'zona',
        'subZona',
        'observaciones'
    ];

    // Función para iniciar la edición de una celda específica
    const startCellEditing = (index: number, field: keyof InstrumentoDTO) => {
        if (editingIndex === null) {
            startEditing(index);
            setEditingCell({ index, field });
        } else if (editingIndex === index) {
            setEditingCell({ index, field });
        }
    };

    // Función para manejar el doble clic en una celda
    const handleDoubleClick = (index: number, field: keyof InstrumentoDTO) => {
        if (editableFields.includes(field)) {
            startCellEditing(index, field);
        }
    };

    // Función para renderizar el contenido de una celda según su modo (visualización o edición)
    const renderCell = (item: InstrumentoDTO, index: number, field: keyof InstrumentoDTO) => {
        const isEditing = editingIndex === index && editedData;
        const isSpecificCellEditing = isEditing && (editingCell.index === index && editingCell.field === field);

        // Renderizar celda en modo edición
        if (isEditing) {
            switch (field) {
                case 'caratula':
                    return (
                        <Input
                            value={editedData.caratula}
                            onChange={(e) => handleInputChange('caratula', e.target.value)}
                            className="w-full text-sm"
                            autoFocus={isSpecificCellEditing || undefined}
                        />
                    );
                case 'juzgadoIdentifier':
                    return (
                        <Select
                            value={editedData.juzgadoIdentifier}
                            onValueChange={(value) => handleInputChange('juzgadoIdentifier', value)}
                        >
                            <SelectTrigger className="w-full text-sm" autoFocus={isSpecificCellEditing || undefined}>
                                <SelectValue placeholder="Seleccionar juzgado" />
                            </SelectTrigger>
                            <SelectContent>
                                {juzgados.map((juzgado) => (
                                    <SelectItem key={juzgado.identifier} value={juzgado.identifier}>
                                        {juzgado.identifier}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    );
                case 'instrumentoTypeIdentifier':
                    return (
                        <Select
                            value={editedData.instrumentoTypeIdentifier}
                            onValueChange={(value) => handleInputChange('instrumentoTypeIdentifier', value)}
                        >
                            <SelectTrigger className="w-full text-sm" autoFocus={isSpecificCellEditing || undefined}>
                                <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                {instrumentoTypes.map((type) => (
                                    <SelectItem key={type.identifier} value={type.identifier}>
                                        {type.identifier}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    );
                case 'fecha_de_ingreso':
                    return (
                        <Input
                            type="date"
                            value={editedData.fecha_de_ingreso ? new Date(editedData.fecha_de_ingreso).toISOString().split('T')[0] : ''}
                            onChange={(e) => handleInputChange('fecha_de_ingreso', new Date(e.target.value))}
                            className="w-full text-sm"
                            autoFocus={isSpecificCellEditing || undefined}
                        />
                    );
                case 'urgencia':
                    return (
                        <Select
                            value={editedData.urgencia}
                            onValueChange={(value) => handleInputChange('urgencia', value)}
                        >
                            <SelectTrigger className="w-full text-sm" autoFocus={isSpecificCellEditing || undefined}>
                                <SelectValue placeholder="Urgencia" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={UrgenciaInstrumento.NORMAL}>Normal</SelectItem>
                                <SelectItem value={UrgenciaInstrumento.URGENTE}>Urgente</SelectItem>
                            </SelectContent>
                        </Select>
                    );
                case 'domicilio_denunciado':
                    return (
                        <AddressAutocomplete
                            defaultValue={editedData.domicilio_denunciado || ''}
                            onChange={(value) => handleInputChange('domicilio_denunciado', value)}
                            miUbicacion={false}
                            autoFocus={isSpecificCellEditing || undefined}
                            setCoords={(lat, lon) => {
                                if (lat && lon) {
                                    const coords = [lon, lat];
                                    handleInputChange('punto', coords);
                                }
                            }}
                        />
                    );
                case 'zona':
                    {
                        return (
                            <Select value={editedData.zona?.zoneName ?? "automatica"} onValueChange={(value) => {
                                const selectedZona = zonas.find(z => z.zoneName === value);
                                handleInputChange('zona', selectedZona);
                            }
                            }>
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
                            </Select >
                        );
                    }
                case 'subZona': {
                    const subzonas = zonas?.find(z => z.zoneName === editedData.zona?.zoneName)?.SubZonas || [];
                    return (
                        <Select value={editedData.subZona ?? "automatica"} onValueChange={(value) => handleInputChange('subZona', value)}>
                            <SelectTrigger className="text-center">
                                <SelectValue
                                    placeholder="Seleccionar subZona"
                                    defaultValue={editedData.subZona ?? "automatica"}
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
                    );
                }
                case 'observaciones':
                    return (
                        <Input
                            value={editedData.observaciones || ''}
                            onChange={(e) => handleInputChange('observaciones', e.target.value)}
                            className="w-full text-sm"
                            autoFocus={isSpecificCellEditing || undefined}
                        />
                    );
                default:
                    return null;
            }
        }

        // Renderizar celda en modo visualización
        switch (field) {
            case 'caratula':
                return item.caratula;
            case 'codigo':
                return item.codigo;
            case 'juzgadoIdentifier':
                return juzgados.find(juzgado => juzgado.identifier === item.juzgadoIdentifier)?.identifier ?? 'N/A';
            case 'instrumentoTypeIdentifier':
                return instrumentoTypes.find(type => type.identifier === item.instrumentoTypeIdentifier)?.identifier ?? 'N/A';
            case 'fecha_de_ingreso':
                return item.fecha_de_ingreso ? new Date(item.fecha_de_ingreso).toLocaleDateString() : 'N/A';
            case 'urgencia':
                return item.urgencia || UrgenciaInstrumento.NORMAL;
            case 'domicilio_denunciado':
                return item.domicilio_denunciado || 'N/A';
            case 'zona':
                return item.zona?.zoneName ?? 'N/A';
            case 'subZona':
                return item.subZona ? item.subZona.replace(/_/g, " ") : 'N/A';
            case 'observaciones':
                return item.observaciones || 'N/A';
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col w-full gap-4 p-2">
            {/* Responsive container for the table */}
            <div className="w-full overflow-x-auto md:overflow-x-visible">
                {/* Table container with adjustable height for desktop */}
                <div className="w-full h-full overflow-y-auto">
                    <table className="w-full h-full border-collapse rounded-lg text-sm table-fixed ">
                        <thead className="sticky top-0 z-10">
                            <tr className="bg-gray-100">
                                {/* Desktop optimized widths */}
                                <th className="px-2 py-2 border border-gray-300 text-center font-medium text-gray-600 uppercase tracking-wider md:w-[15%] w-[150px]">Carátula</th>
                                <th className="px-1 py-2 border border-gray-300 text-center font-medium text-gray-600 uppercase tracking-wider md:w-[8%] w-[80px]">Codigo</th>
                                <th className="px-1 py-2 border border-gray-300 text-center font-medium text-gray-600 uppercase tracking-wider md:w-[7%] w-[100px]">Juzgado</th>
                                <th className="px-1 py-2 border border-gray-300 text-center font-medium text-gray-600 uppercase tracking-wider md:w-[6%] w-[80px]">Tipo</th>
                                <th className="px-1 py-2 border border-gray-300 text-center font-medium text-gray-600 uppercase tracking-wider md:w-[12%] w-[100px]">Fecha</th>
                                <th className="px-1 py-2 border border-gray-300 text-center font-medium text-gray-600 uppercase tracking-wider md:w-[5%] w-[60px]">Urg.</th>
                                <th className="px-1 py-2 border border-gray-300 text-center font-medium text-gray-600 uppercase tracking-wider md:w-[15%] w-[180px]">Domicilio</th>
                                <th className="px-1 py-2 border border-gray-300 text-center font-medium text-gray-600 uppercase tracking-wider md:w-[7%] w-[100px]">Zona</th>
                                <th className="px-1 py-2 border border-gray-300 text-center font-medium text-gray-600 uppercase tracking-wider md:w-[7%] w-[100px]">SubZona</th>
                                <th className="px-1 py-2 border border-gray-300 text-center font-medium text-gray-600 uppercase tracking-wider md:w-[8%] w-[150px]">Obs.</th>
                                <th className="px-1 py-2 border border-gray-300 text-center font-medium text-gray-600 uppercase tracking-wider md:w-[8%] w-[100px]">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={"excel_row_" + index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td
                                        className="px-2 py-2 border border-gray-300 text-gray-900 cursor-pointer truncate"
                                        onDoubleClick={() => handleDoubleClick(index, 'caratula')}
                                        title={item.caratula}
                                    >
                                        {renderCell(item, index, 'caratula')}
                                    </td>
                                    <td className="px-2 py-2 border border-gray-300 text-gray-900 text-center truncate" title={item.codigo || 'N/A'}>
                                        {item.codigo || 'N/A'}
                                    </td>
                                    <td
                                        className="px-2 py-2 border border-gray-300 text-gray-900 text-center cursor-pointer truncate"
                                        onDoubleClick={() => handleDoubleClick(index, 'juzgadoIdentifier')}
                                        title={juzgados.find(juzgado => juzgado.identifier === item.juzgadoIdentifier)?.identifier ?? 'N/A'}
                                    >
                                        {renderCell(item, index, 'juzgadoIdentifier')}
                                    </td>
                                    <td
                                        className="px-2 py-2 border border-gray-300 text-gray-900 text-center cursor-pointer truncate"
                                        onDoubleClick={() => handleDoubleClick(index, 'instrumentoTypeIdentifier')}
                                        title={instrumentoTypes.find(type => type.identifier === item.instrumentoTypeIdentifier)?.identifier ?? 'N/A'}
                                    >
                                        {renderCell(item, index, 'instrumentoTypeIdentifier')}
                                    </td>
                                    <td
                                        className="px-2 py-2 border border-gray-300 text-gray-900 text-center cursor-pointer truncate"
                                        onDoubleClick={() => handleDoubleClick(index, 'fecha_de_ingreso')}
                                        title={item.fecha_de_ingreso ? new Date(item.fecha_de_ingreso).toLocaleDateString() : 'N/A'}
                                    >
                                        {renderCell(item, index, 'fecha_de_ingreso')}
                                    </td>
                                    <td
                                        className="px-2 py-2 border border-gray-300 text-gray-900 text-center cursor-pointer truncate"
                                        onDoubleClick={() => handleDoubleClick(index, 'urgencia')}
                                        title={item.urgencia || UrgenciaInstrumento.NORMAL}
                                    >
                                        {renderCell(item, index, 'urgencia')}
                                    </td>
                                    <td
                                        className="px-2 py-2 border border-gray-300 text-gray-900 cursor-pointer text-center truncate"
                                        onDoubleClick={() => handleDoubleClick(index, 'domicilio_denunciado')}
                                        title={item.domicilio_denunciado || 'N/A'}
                                    >
                                        <div className="max-w-full mx-auto overflow-hidden text-ellipsis">
                                            {renderCell(item, index, 'domicilio_denunciado')}
                                        </div>
                                    </td>
                                    <td
                                        className="px-2 py-2 border border-gray-300 text-gray-900 text-center cursor-pointer truncate"
                                        onDoubleClick={() => handleDoubleClick(index, 'zona')}
                                        title={item.zona?.zoneName ?? 'N/A'}
                                    >
                                        {renderCell(item, index, 'zona')}
                                    </td>
                                    <td
                                        className="px-2 py-2 border border-gray-300 text-gray-900 text-center cursor-pointer truncate"
                                        onDoubleClick={() => handleDoubleClick(index, 'subZona')}
                                        title={item.subZona ? item.subZona.replace(/_/g, " ") : 'N/A'}
                                    >
                                        {renderCell(item, index, 'subZona')}
                                    </td>
                                    <td
                                        className="px-2 py-2 border border-gray-300 text-gray-900 text-center cursor-pointer truncate"
                                        onDoubleClick={() => handleDoubleClick(index, 'observaciones')}
                                        title={item.observaciones || 'N/A'}
                                    >
                                        {renderCell(item, index, 'observaciones')}
                                    </td>
                                    <td className="px-2 py-2 border border-gray-300">
                                        <div className="flex items-center justify-center gap-2">
                                            {editingIndex === index ? (
                                                <>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                className="bg-yellow-500 hover:bg-yellow-600 text-white h-8 w-8 p-0"
                                                                onClick={() => onEditDialog(item)}
                                                            >
                                                                <Edit className="h-4 w-4 text-white" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Más Opciones</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                className="bg-green-500 hover:bg-green-600 text-white h-8 w-8 p-0"
                                                                onClick={saveEditedData}
                                                            >
                                                                <CheckIcon className="h-4 w-4 text-white" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Guardar</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                className="bg-gray-500 hover:bg-gray-600 text-white h-8 w-8 p-0"
                                                                onClick={() => {
                                                                    cancelEditing();
                                                                    setEditingCell({ index: null, field: null });
                                                                }}
                                                            >
                                                                <XIcon className="h-4 w-4 text-white" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Cancelar</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </>
                                            ) : (
                                                <>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                className="bg-blue-500 hover:bg-blue-600 text-white h-8 w-8 p-0"
                                                                onClick={() => startEditing(index)}
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
                                                                className="bg-red-500 hover:bg-red-600 text-white h-8 w-8 p-0"
                                                                onClick={() => onCancelarCarga(item)}
                                                            >
                                                                <Delete className="h-4 w-4 text-white" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Cancelar</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-sm text-gray-600">
                    <span className="font-medium">Total de registros:</span> {data.length}
                </p>
            </div>
        </div>
    );
}