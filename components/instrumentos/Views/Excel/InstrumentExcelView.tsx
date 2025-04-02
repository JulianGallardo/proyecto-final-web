import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CheckIcon, XIcon, Edit, Delete } from "lucide-react";
import { InstrumentoExtendido } from "@/types/instrumentoTypes";

interface InstrumentoExcelViewProps {
  data: InstrumentoExtendido[];
  onEdit: (instrumento: InstrumentoExtendido) => void;
  onDelete: (instrumento: InstrumentoExtendido) => void;
}

export default function InstrumentoExcelView({ data, onEdit, onDelete }: Readonly<InstrumentoExcelViewProps>) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<InstrumentoExtendido | null>(null);

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditedData({ ...data[index] });
  };

  const handleInputChange = (field: keyof InstrumentoExtendido, value: any) => {
    if (editedData) {
      setEditedData({ ...editedData, [field]: value });
    }
  };

  const saveEditedData = () => {
    if (editedData) {
      onEdit(editedData);
    }
    setEditingIndex(null);
    setEditedData(null);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditedData(null);
  };

  return (
    <div className="flex flex-col w-full gap-6 p-4">
      <table className="w-full border-collapse rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-3 py-2 border">Carátula</th>
            <th className="px-3 py-2 border">Código</th>
            <th className="px-3 py-2 border">Juzgado</th>
            <th className="px-3 py-2 border">Tipo de Instrumento</th>
            <th className="px-3 py-2 border">Fecha Ingreso</th>
            <th className="px-3 py-2 border">Urgencia</th>
            <th className="px-3 py-2 border">Domicilio</th>
            <th className="px-3 py-2 border">Observaciones</th>
            <th className="px-3 py-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((instrumento, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              {editingIndex === index && editedData ? (
                <>
                  <td className="px-3 py-2 border">
                    <Input value={editedData.caratula} onChange={(e) => handleInputChange("caratula", e.target.value)} />
                  </td>
                  <td className="px-3 py-2 border">{editedData.codigoInstrumento}</td>
                  <td className="px-3 py-2 border">
                    <Select value={editedData.orden.juzgado.identifier} onValueChange={(value) => handleInputChange("orden", { ...editedData.orden, juzgado: { identifier: value, name: "" } })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar juzgado" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Opciones de juzgado */}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-3 py-2 border">
                    <Select value={editedData.instrumentoType.identifier} onValueChange={(value) => handleInputChange("instrumentoType", { ...editedData.instrumentoType, identifier: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Opciones de tipo */}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-3 py-2 border">
                    <Input type="date" value={new Date(editedData.fecha_de_ingreso).toISOString().split("T")[0]} onChange={(e) => handleInputChange("fecha_de_ingreso", new Date(e.target.value))} />
                  </td>
                  <td className="px-3 py-2 border">
                    <Select value={editedData.urgencia} onValueChange={(value) => handleInputChange("urgencia", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Urgencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NORMAL">Normal</SelectItem>
                        <SelectItem value="URGENTE">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-3 py-2 border">
                    <Input value={editedData.domicilio_denunciado} onChange={(e) => handleInputChange("domicilio_denunciado", e.target.value)} />
                  </td>
                  <td className="px-3 py-2 border">
                    <Input value={editedData.observaciones || ""} onChange={(e) => handleInputChange("observaciones", e.target.value)} />
                  </td>
                  <td className="px-3 py-2 border">
                    <Button onClick={saveEditedData}><CheckIcon /></Button>
                    <Button onClick={cancelEditing}><XIcon /></Button>
                  </td>
                </>
              ) : (
                <>
                  <td className="px-3 py-2 border">{instrumento.caratula}</td>
                  <td className="px-3 py-2 border">{instrumento.codigoInstrumento}</td>
                  <td className="px-3 py-2 border">{instrumento.orden.juzgado.name}</td>
                  <td className="px-3 py-2 border">{instrumento.instrumentoType.name}</td>
                  <td className="px-3 py-2 border">{new Date(instrumento.fecha_de_ingreso).toLocaleDateString()}</td>
                  <td className="px-3 py-2 border">{instrumento.urgencia}</td>
                  <td className="px-3 py-2 border">{instrumento.domicilio_denunciado}</td>
                  <td className="px-3 py-2 border">{instrumento.observaciones || "N/A"}</td>
                  <td className="px-3 py-2 border">
                    <Button onClick={() => startEditing(index)}><Edit /></Button>
                    <Button onClick={() => onDelete(instrumento)}><Delete /></Button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
