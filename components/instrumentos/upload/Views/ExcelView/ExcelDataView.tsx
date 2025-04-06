import AddressAutocomplete from "@/components/planificador-de-ruta/addresAutoComplete";
import { Button } from "@/components/ui/button";
import { InstrumentoDTO } from "@/types/instrumentoTypes";
import { Juzgado, InstrumentoType, UrgenciaInstrumento } from "@prisma/client";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CheckIcon, XIcon, Edit, Delete } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ExcelDataViewProps {
    juzgados: Juzgado[];
    data: InstrumentoDTO[];
    onCancelarCarga: (error: InstrumentoDTO) => void;


    instrumentoTypes: InstrumentoType[];
    editingIndex: number | null;
    editedData: InstrumentoDTO | null;
    startEditing: (index: number) => void;
    handleInputChange: (field: keyof InstrumentoDTO, value: any) => void;
    saveEditedData: () => void;
    cancelEditing: () => void;
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
    cancelEditing
}: Readonly<ExcelDataViewProps>) {
    return (
        <div className="flex flex-col w-full gap-6 p-4">

            <div className="w-full overflow-x-auto ">
                <table className="w-full border-collapse rounded-lg ">
                    <thead>
                        <tr className="bg-gray-100 ">
                            <th className="px-3 py-2 border border-gray-300 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Carátula</th>

                            <th className="px-3 py-2 border border-gray-300 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Codigo</th>
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
                        {data.map((error, index) => (
                            <tr key={"excel_row_" + index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                {editingIndex === index && editedData ? (
                                    // Modo edición
                                    <>
                                        <td className="px-3 py-2 border border-gray-300">
                                            <Input
                                                value={editedData.caratula}
                                                onChange={(e) => handleInputChange('caratula', e.target.value)}
                                                className="w-full text-sm"
                                            />
                                        </td>
                                        <td className="px-3 py-2 border border-gray-300">
                                            {
                                                editedData.codigo || 'N/A'
                                            }
                                        </td>
                                        <td className="px-3 py-2 border border-gray-300 w-fit">

                                            <Select
                                                value={editedData.juzgadoIdentifier}
                                                onValueChange={(value) => handleInputChange('juzgadoIdentifier', value)}
                                            >
                                                <SelectTrigger className="w-full text-sm">
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
                                        </td>
                                        <td className="px-3 py-2 border border-gray-300 w-fit">
                                            <Select
                                                value={editedData.instrumentoTypeIdentifier}
                                                onValueChange={(value) => handleInputChange('instrumentoTypeIdentifier', value)}
                                            >
                                                <SelectTrigger className="w-full text-sm">
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
                                        </td>
                                        <td className="px-3 py-2 border border-gray-300 w-fit">
                                            <Input
                                                type="date"
                                                value={editedData.fecha_de_ingreso ? new Date(editedData.fecha_de_ingreso).toISOString().split('T')[0] : ''}
                                                onChange={(e) => handleInputChange('fecha_de_ingreso', new Date(e.target.value))}
                                                className="w-full text-sm"
                                            />
                                        </td>
                                        <td className="px-3 py-2 border border-gray-300 w-fit">
                                            <Select
                                                value={editedData.urgencia}
                                                onValueChange={(value) => handleInputChange('urgencia', value)}
                                            >
                                                <SelectTrigger className="w-full text-sm">
                                                    <SelectValue placeholder="Urgencia" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={UrgenciaInstrumento.NORMAL}>Normal</SelectItem>
                                                    <SelectItem value={UrgenciaInstrumento.URGENTE}>Urgente</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        <td className="px-3 py-2 border border-gray-300 w-80">
                                            <AddressAutocomplete
                                                defaultValue={editedData.domicilio_denunciado || ''}
                                                onChange={(value) => handleInputChange('domicilio_denunciado', value)}
                                                miUbicacion={false}
                                            />
                                        </td>
                                        <td className="px-3 py-2 border border-gray-300 w-fit">
                                            <Input
                                                value={editedData.observaciones || ''}
                                                onChange={(e: { target: { value: any; }; }) => handleInputChange('observaciones', e.target.value)}  // eslint-disable-line
                                                className="w-full text-sm"

                                            />
                                        </td>
                                        <td className="px-3 py-2 border border-gray-300 w-fit">
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    size="sm"
                                                    className="bg-green-500 hover:bg-green-600 text-white text-xs"
                                                    onClick={saveEditedData}
                                                >
                                                    <CheckIcon className="h-3 w-3 mr-1" />
                                                    Guardar
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="bg-gray-500 hover:bg-gray-600 text-white text-xs"
                                                    onClick={cancelEditing}
                                                >
                                                    <XIcon className="h-3 w-3 mr-1" />
                                                    Cancelar
                                                </Button>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    // Modo visualización
                                    <>
                                        <td className="px-3 py-2 border border-gray-300 text-sm text-gray-900">{error.caratula}</td>
                                        <td className="px-3 py-2 border border-gray-300 text-sm text-gray-900">{error.codigo}</td>
                                        <td className="px-3 py-2 border border-gray-300 text-sm text-gray-900">
                                            {juzgados.find(juzgado => juzgado.identifier === error.juzgadoIdentifier)?.name ?? 'N/A'}
                                        </td>
                                        <td className={`px-3 py-2 border border-gray-300 text-sm text-gray-900`}>
                                            {instrumentoTypes.find(type => type.identifier === error.instrumentoTypeIdentifier)?.name ?? 'N/A'}
                                        </td>
                                        <td className="px-3 py-2 border border-gray-300 text-sm text-gray-900">
                                            {error.fecha_de_ingreso ? new Date(error.fecha_de_ingreso).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-3 py-2 border border-gray-300 text-sm text-gray-900">
                                            {error.urgencia || UrgenciaInstrumento.NORMAL}
                                        </td>
                                        <td className="px-3 py-2 w-80 border border-gray-300 text-sm text-gray-900">
                                            {error.domicilio_denunciado || 'N/A'}
                                        </td>
                                        <td className="px-3 py-2 border border-gray-300 text-sm text-gray-900">
                                            {error.observaciones || 'N/A'}
                                        </td>
                                        <td className="px-3 py-2 border border-gray-300">
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    size="sm"
                                                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs"
                                                    onClick={() => startEditing(index)}
                                                >
                                                    <Edit className="h-3 w-3 mr-1" />
                                                    Editar
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="bg-red-500 hover:bg-red-600 text-white text-xs"
                                                    onClick={() => onCancelarCarga(error)}
                                                >
                                                    <Delete className="h-3 w-3 mr-1" />
                                                    Cancelar
                                                </Button>
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                <p className="text-sm text-gray-600">
                    <span className="font-medium">Total de registros:</span> {data.length}
                </p>
            </div>
        </div>
    );
}