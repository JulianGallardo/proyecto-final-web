"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

interface Entrega {
  id: number;
  instrumentoId: number;
  caratula: string;
  destinatario: string;
  domicilio_denunciado: string;
  fecha_de_salida: string;
}

export default function EntregasRepartidor({ agenteId }: { agenteId: number }) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const { toast } = useToast();

  const handleDateSelect = async (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      try {
        const entregas = [
          {
            id: 1,
            instrumentoId: 1,
            caratula: "Carátula 1",
            destinatario: "Destinatario 1",
            domicilio_denunciado: "Domicilio 1",
            fecha_de_salida: new Date().toISOString(),
          },
          {
            id: 2,
            instrumentoId: 2,
            caratula: "Carátula 2",
            destinatario: "Destinatario 2",
            domicilio_denunciado: "Domicilio 2",
            fecha_de_salida: new Date().toISOString(),
          },
        ];
        setEntregas(entregas);
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar las entregas.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6 p-6 ">
      <Card className="">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Seleccionar Fecha</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="date"
            className="w-full p-2 border rounded-md"
            value={date?.toISOString().split("T")[0]}
            onChange={(e) => handleDateSelect(new Date(e.target.value))}
          />
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Entregas del día {date?.toLocaleDateString()}</CardTitle>
        </CardHeader>
        <CardContent>
          {entregas.length > 0 ? (
            <ul className="space-y-3">
              {entregas.map((entrega) => (
                <li key={entrega.id} className="p-4 bg-white shadow-sm rounded-lg border-l-4 border-blue-500">
                  <p className="text-sm font-medium text-gray-700">
                    <strong>Carátula:</strong> {entrega.caratula}
                  </p>
                  <p className="text-sm font-medium text-gray-700">
                    <strong>Destinatario:</strong> {entrega.destinatario}
                  </p>
                  <p className="text-sm font-medium text-gray-700">
                    <strong>Domicilio:</strong> {entrega.domicilio_denunciado}
                  </p>
                  <p className="text-sm font-medium text-gray-700">
                    <strong>Fecha de salida:</strong> {new Date(entrega.fecha_de_salida).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No hay entregas para esta fecha.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}