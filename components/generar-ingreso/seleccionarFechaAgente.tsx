"use client";

import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AgenteExtendidoDto } from "@/types/agenteTypes";
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
    const handleAgentChange = (agenteId: string) => {
        const agente = agentes.find(a => a.id === Number(agenteId));
        if (agente) {
            onAgentSelect?.(agente);
        }
    };

    const handleDateChange = (date: Date | undefined) => {
        if (date) {
            onDateSelect?.(date);
        }
    };

    return (
        <div className="flex flex-col space-y-4 w-full max-w-md">
            
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
                                {agente.user.name} {agente.user.lastname}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

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