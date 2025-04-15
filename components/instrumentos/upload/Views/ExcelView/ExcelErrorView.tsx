import AddressAutocomplete from "@/components/planificador-de-ruta/addresAutoComplete";
import { Button } from "@/components/ui/button";
import { InstrumentoDTO } from "@/types/instrumentoTypes";
import { Juzgado, InstrumentoType, UrgenciaInstrumento } from "@prisma/client";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CheckIcon, XIcon, Edit, Delete } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ErrorListProps } from "../ListView/ErrorListView";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

interface ErrorExcelViewProps extends ErrorListProps {
    juzgados: Juzgado[];
    instrumentoTypes: InstrumentoType[];
    editingIndex: number | null;
    editedData: InstrumentoDTO | null;
    startEditing: (index: number) => void;
    handleInputChange: (field: keyof InstrumentoDTO, value: any) => void;  // eslint-disable-line
    saveEditedData: () => void;
    cancelEditing: () => void;
}

export default function ErrorExcelView({
    title,
    instrumentErrors,
    onCancelarCarga,
    juzgados,
    instrumentoTypes,
    editingIndex,
    editedData,
    startEditing,
    handleInputChange,
    saveEditedData,
    cancelEditing
}: Readonly<ErrorExcelViewProps>) {
    // Estado para la celda específica que se está editando
    const [editingCell, setEditingCell] = useState<{
        index: number | null,
        field: keyof InstrumentoDTO | null
    }>({ index: null, field: null });

    // Campos que pueden ser editados con doble clic
    const editableFields: Array<keyof InstrumentoDTO> = [
        'caratula', 
        'juzgadoIdentifier', 
        'instrumentoTypeIdentifier', 
        'fecha_de_ingreso', 
        'urgencia', 
        'domicilio_denunciado', 
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
        const isSpecificCellEditing  = isEditing && (editingCell.index === index && editingCell.field === field);
        
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
                                        {juzgado.name}
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
                                        {type.name}
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
                        />
                    );
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
            case 'juzgadoIdentifier':
                return item.juzgadoIdentifier || 'N/A';
            case 'instrumentoTypeIdentifier':
                return instrumentoTypes.find(type => type.identifier === item.instrumentoTypeIdentifier)?.name ?? 'N/A';
            case 'fecha_de_ingreso':
                return item.fecha_de_ingreso ? new Date(item.fecha_de_ingreso).toLocaleDateString() : 'N/A';
            case 'urgencia':
                return item.urgencia || UrgenciaInstrumento.NORMAL;
            case 'domicilio_denunciado':
                return item.domicilio_denunciado || 'N/A';
            case 'observaciones':
                return item.observaciones || 'N/A';
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col w-full gap-6 p-4 bg-white rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2">{title}</h3>

            <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-3 py-2 border border-gray-300 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Carátula</th>
                            <th className="px-3 py-2 border border-gray-300 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Error</th>
                            <th className="px-3 py-2 border border-gray-300 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Juzgado</th>
                            <th className="px-3 py-2 border border-gray-300 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tipo de Instrumento</th>
                            <th className="px-3 py-2 border border-gray-300 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Fecha Ingreso</th>
                            <th className="px-3 py-2 border border-gray-300 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Urgencia</th>
                            <th className="px-3 py-2 border border-gray-300 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Domicilio</th>
                            <th className="px-3 py-2 border border-gray-300 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Observaciones</th>
                            <th className="px-3 py-2 border border-gray-300 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {instrumentErrors.map((error, index) => (
                            <tr key={"excel_row_" + index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td 
                                    className="px-3 py-2 border border-gray-300 text-sm text-gray-900 cursor-pointer"
                                    onDoubleClick={() => handleDoubleClick(index, 'caratula')}
                                >
                                    {renderCell(error, index, 'caratula')}
                                </td>
                                <td className="px-3 py-2 border border-gray-300 text-sm text-red-600 font-medium">
                                    {error.error}
                                </td>
                                <td 
                                    className={`px-3 py-2 border border-gray-300 text-sm ${error.error?.includes("Juzgado") ? 'text-red-600 font-medium' : 'text-gray-900'} cursor-pointer`}
                                    onDoubleClick={() => handleDoubleClick(index, 'juzgadoIdentifier')}
                                >
                                    {renderCell(error, index, 'juzgadoIdentifier')}
                                </td>
                                <td 
                                    className={`px-3 py-2 border border-gray-300 text-sm ${error.error?.includes("tipo de instrumento") || error.error?.includes("Tipo de instrumento inválido") ? 'text-red-600 font-medium' : 'text-gray-900'} cursor-pointer`}
                                    onDoubleClick={() => handleDoubleClick(index, 'instrumentoTypeIdentifier')}
                                >
                                    {renderCell(error, index, 'instrumentoTypeIdentifier')}
                                </td>
                                <td 
                                    className="px-3 py-2 border border-gray-300 text-sm text-gray-900 cursor-pointer"
                                    onDoubleClick={() => handleDoubleClick(index, 'fecha_de_ingreso')}
                                >
                                    {renderCell(error, index, 'fecha_de_ingreso')}
                                </td>
                                <td 
                                    className="px-3 py-2 border border-gray-300 text-sm text-gray-900 cursor-pointer"
                                    onDoubleClick={() => handleDoubleClick(index, 'urgencia')}
                                >
                                    {renderCell(error, index, 'urgencia')}
                                </td>
                                <td 
                                    className="px-3 py-2 border border-gray-300 text-sm text-gray-900 w-80 cursor-pointer"
                                    onDoubleClick={() => handleDoubleClick(index, 'domicilio_denunciado')}
                                >
                                    {renderCell(error, index, 'domicilio_denunciado')}
                                </td>
                                <td 
                                    className="px-3 py-2 border border-gray-300 text-sm text-gray-900 cursor-pointer"
                                    onDoubleClick={() => handleDoubleClick(index, 'observaciones')}
                                >
                                    {renderCell(error, index, 'observaciones')}
                                </td>
                                <td className="px-3 py-2 border border-gray-300">
                                    <div className="flex items-center gap-1">
                                        {editingIndex === index ? (
                                            <>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            className="bg-green-500 hover:bg-green-600 text-white text-xs"
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
                                                            className="bg-gray-500 hover:bg-gray-600 text-white text-xs"
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
                                                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs"
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
                                                            className="bg-red-500 hover:bg-red-600 text-white text-xs"
                                                            onClick={() => onCancelarCarga(error)}
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

            <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                <p className="text-sm text-gray-600">
                    <span className="font-medium">Total de registros con errores:</span> {instrumentErrors.length}
                </p>
            </div>
        </div>
    );
}