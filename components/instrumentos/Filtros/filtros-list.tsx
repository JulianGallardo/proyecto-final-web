"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { InstrumentoType, Juzgado } from "@prisma/client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface FiltroListProps {
    Juzgados: Juzgado[];
    InstrumentTypes: InstrumentoType[];
}

export default function FiltrosList({ Juzgados, InstrumentTypes }: Readonly<FiltroListProps>) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [open, setOpen] = useState(false);

    // Configuración de filtros
    const filtrosConfig = [
        { param: "entryDate", displayName: "Fecha de Entrada", type: "date" },
        { param: "exitDate", displayName: "Fecha de Salida", type: "date" },
        { param: "caratula", displayName: "Carátula", type: "text" },
        { param: "destinatario", displayName: "Destinatario", type: "text" },
        { param: "address", displayName: "Dirección", type: "text" },
        { param: "ordenNumber", displayName: "Número de Orden", type: "text" },
        {
            param: "juzgado",
            displayName: "Identificador de Juzgado",
            type: "select",
            options: Juzgados.map((j) => ({ value: j.identifier, label: j.identifier })),
        },
        {
            param: "instrumentType",
            displayName: "Tipo de Instrumento",
            type: "select",
            options: InstrumentTypes.map((i) => ({ value: i.name, label: i.name })),
        },
    ];

    // Maneja la búsqueda en los parámetros
    function handleSearch(param: string, value: string | null) {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(param, value);
        } else {
            params.delete(param);
        }
        replace(`${pathname}?${params.toString()}`);
    }

    // Limpia todos los parámetros
    function clearFilters() {
        const params = new URLSearchParams(searchParams);
        filtrosConfig.forEach((f) => params.delete(f.param));
        replace(`${pathname}?${params.toString()}`);
    }

    // Maneja la apertura del panel y limpieza
    function handleOpen(open: boolean) {
        if (!open) clearFilters();
        setOpen(open);
    }

    return (
        <Accordion type="single" collapsible className="border border-gray-300 rounded-lg shadow-md">
            <AccordionItem value="filtros" className="overflow-hidden">
                <AccordionTrigger
                    onClick={() => handleOpen(!open)}
                    className="flex items-center justify-between px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-t-lg"
                >
                    Filtros
                </AccordionTrigger>
                <AccordionContent className="p-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtrosConfig.map((filtro) => (
                        <Filtro
                            key={filtro.param}
                            param={filtro.param}
                            displayName={filtro.displayName}
                            onChange={(value) => handleSearch(filtro.param, value)}
                        >
                            {filtro.type === "select" ? (
                                <Select onValueChange={(value) => handleSearch(filtro.param, value)}>
                                    <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm bg-white px-3 py-2 hover:ring hover:ring-blue-500 focus:ring focus:ring-blue-500 focus:outline-none">
                                        <SelectValue placeholder={`Seleccione ${filtro.displayName}`} className="text-sm text-gray-700" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg">
                                        <SelectGroup>
                                            {filtro.options?.map((option) => (
                                                <SelectItem key={option.value} value={option.value} className="px-3 py-2 hover:bg-blue-100">
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Input
                                    type={filtro.type}
                                    placeholder={filtro.displayName}
                                    className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm focus:ring focus:ring-blue-500 focus:outline-none"
                                    onChange={(e) => handleSearch(filtro.param, e.target.value)}
                                />
                            )}
                        </Filtro>
                    ))}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}

interface FiltroProps {
    param: string;
    displayName: string;
    children: React.ReactNode;
    onChange: (value: string | null) => void;
}

function Filtro({ param, displayName, children, onChange }: Readonly<FiltroProps>) {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (!isActive) onChange(null); // Limpia el filtro si se desactiva
    }, [isActive]);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
                <Checkbox
                    checked={isActive}
                    onClick={() => setIsActive(!isActive)}
                    className={`w-5 h-5 border-2 rounded-md ${
                        isActive ? "bg-blue-500 border-blue-500" : "border-gray-400"
                    }`}
                />
                <span className="text-sm text-gray-800 font-medium">{displayName}</span>
            </div>
            {isActive && <div className="mt-2">{children}</div>}
        </div>
    );
}
