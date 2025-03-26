"use client";

import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { AgenteExtendidoDto } from "@/types/agenteTypes";
import { cn } from "@/lib/utils";
import { Input } from '../ui/input';

export default function SeleccionarFechaAgente({
    agentes,
    onAgentSelect,
    onDateSelect
}: Readonly<{
    agentes: AgenteExtendidoDto[];
    onAgentSelect: (agente: AgenteExtendidoDto) => void;
    onDateSelect: (date: Date) => void;
}>) {
    const [selectedAgente, setSelectedAgente] = useState<AgenteExtendidoDto | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    const handleAgentChange = (agenteId: string) => {
        const agente = agentes.find(a => a.id === Number(agenteId));
        if (agente) {
            setSelectedAgente(agente);
            onAgentSelect?.(agente);
        }
    };

    const handleDateChange = (date: Date | undefined) => {
        setSelectedDate(date);
        if (date) {
            onDateSelect?.(date);
        }
    };

    return (
        <div className="flex flex-col space-y-4 w-full max-w-md">
            {/* Agent Selection */}
            <div>
                <label htmlFor="agent-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar Agente
                </label>
                <Select onValueChange={handleAgentChange}>
                    <SelectTrigger id="agent-select">
                        <SelectValue placeholder="Seleccione un agente" />
                    </SelectTrigger>
                    <SelectContent>
                        {agentes.map((agente) => (
                            <SelectItem key={agente.id} value={agente.id.toString()}>
                                {agente.name} {agente.user.lastname}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Date Picker */}
            <div>
                <label htmlFor="date-picker" className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar Fecha
                </label>
                <Input
                    id="date-picker"
                    type="date"
                    onChange={(e) => handleDateChange(new Date(e.target.value))}
                    className="w-full p-2 rounded-md"
                />
            </div>
        </div>
    );
}