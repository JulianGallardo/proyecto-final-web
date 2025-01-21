"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { useState } from "react"
import { Checkbox } from "../ui/checkbox"
import { Input } from "../ui/input"
import { InstrumentoType, Juzgado } from "@prisma/client"

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"


interface FiltroListProps {
    Juzgados: Juzgado[],
    InstrumentTypes: InstrumentoType[]
}


export default function FiltrosList({ Juzgados, InstrumentTypes }: Readonly<FiltroListProps>) {
    const [juzgado, setJuzgado] = useState<string | null>(null);
    const [instrumentType, setInstrumentType] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const searchParams = useSearchParams()
    const pathname = usePathname();
    const { replace } = useRouter();

    

    function handleSearch(query: string, term: string) {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set(query, term);
        } else {
            params.delete(query);
        }

        replace(`${pathname}?${params.toString()}`);

    }


    function deleteParams() {
        const params = new URLSearchParams(searchParams)
        params.delete("entryDate");
        params.delete("exitDate");
        params.delete("caratula");
        params.delete("destinatario");
        params.delete("address");
        params.delete("ordenNumber");
        params.delete("juzgado");
        params.delete("instrumentType");
        replace(`${pathname}?${params.toString()}`);
    }


    function handleOpen(open: boolean) {
        console.log(open)
        if (!open) {
            deleteParams()
        }
        setOpen(open)
    }

    return (
        <Accordion
            type="single"

            collapsible

            className="border border-gray-200 rounded-lg "

        >
            <AccordionItem value="filtros" className="overflow-hidden ">
                <AccordionTrigger onClick={() => handleOpen(!open)} className="flex items-center justify-between px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium">
                    Filtros
                </AccordionTrigger>
                <AccordionContent className="p-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 ">
                    <Filtro nameFiltro="Fecha de Entrada"  >
                        <Input
                            type="date"
                            className="w-full"
                            placeholder="Fecha de Entrada"
                            name="entryDate"
                            onChange={(e) => handleSearch(
                                e.target.name,
                                e.target.value)}
                        />
                    </Filtro>
                    <Filtro nameFiltro="Fecha de Salida" >
                        <Input
                            type="date"
                            className="w-full"
                            placeholder="Fecha de Salida"
                            name="exitDate"
                            onChange={(e) => handleSearch(
                                e.target.name,
                                e.target.value)}
                        />
                    </Filtro>
                    <Filtro nameFiltro="Carátula" >
                        <Input
                            type="text"
                            className="w-full"
                            placeholder="Carátula"
                            name="caratula"
                            onChange={(e) => handleSearch(
                                e.target.name,
                                e.target.value)}
                        />
                    </Filtro>
                    <Filtro nameFiltro="Destinatario" >
                        <Input
                            type="text"
                            className="w-full"
                            placeholder="Destinatario"
                            name="destinatario"
                            onChange={(e) => handleSearch(
                                e.target.name,
                                e.target.value)}
                        />
                    </Filtro>
                    <Filtro nameFiltro="Dirección" >
                        <Input
                            type="text"
                            className="w-full"
                            placeholder="Dirección"
                            name="address"
                            onChange={(e) => handleSearch(
                                e.target.name,
                                e.target.value)}
                        />
                    </Filtro>
                    <Filtro nameFiltro="Número de Orden" >
                        <Input
                            type="text"
                            className="w-full"
                            placeholder="Número de Orden"
                            name="ordenNumber"
                            onChange={(e) => handleSearch(
                                e.target.name,
                                e.target.value)}
                        />
                    </Filtro>
                    <Filtro nameFiltro="Identificador de Juzgado" >
                        <Select
                            defaultValue={juzgado ?? ""}
                            value={juzgado ?? ""}
                            onValueChange={
                                (e) => {
                                    setJuzgado(e.toString());
                                    handleSearch("juzgado", e.toString())
                                }
                            }  >
                            <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm hover:ring focus:ring focus:ring-blue-500 focus:outline-none bg-white px-3 py-2">
                                <SelectValue placeholder="Seleccione un Juzgado" className="text-sm" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200 rounded-md shadow-md mt-1">
                                <SelectGroup>
                                    {Juzgados.map((juzgado) => (
                                        <SelectItem key={juzgado.id} value={juzgado.identifier} className="flex items-center px-3 py-2 hover:bg-gray-100 focus:bg-gray-200 text-gray-700 cursor-pointer">
                                            {juzgado.identifier}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Filtro>
                    <Filtro nameFiltro="Tipo de Instrumento" >
                        <Select
                            defaultValue={instrumentType ?? ""}
                            value={instrumentType ?? ""}
                            onValueChange={
                                (e) => {
                                    setInstrumentType(e.toString());
                                    console.log(e.toString())
                                    handleSearch("instrumentType", e.toString())
                                }
                            }  >
                            <SelectTrigger className="w-full  border border-gray-300 rounded-md shadow-sm hover:ring focus:ring focus:ring-blue-500 focus:outline-none bg-white px-3 py-2">
                                <SelectValue placeholder="Seleccione un tipo de instrumento" className="text-sm w-full" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200 rounded-md shadow-md mt-1" >

                                <SelectGroup >
                                    {InstrumentTypes.map((instrumentoType) => (
                                        <SelectItem key={instrumentoType.id} value={instrumentoType.name} className="flex items-center px-3 py-2 hover:bg-gray-100 focus:bg-gray-200 text-gray-700 cursor-pointer">
                                            {instrumentoType.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                    </Filtro>

                </AccordionContent>
            </AccordionItem>
        </Accordion>

    )

}


interface FiltroProps {
    children?: React.ReactNode;
    nameFiltro: string;

}


function Filtro({ nameFiltro, children }: Readonly<FiltroProps>) {
    const [activado, setActivado] = useState(false);

    return (
        <AccordionContent className="flex flex-col  gap-2 ">
            <div className="flex flex-row gap-2">
                <Checkbox
                    checked={activado}
                    onClick={() => setActivado(!activado)}
                    className={`w-5 h-5 border-2 rounded-md ${activado ? "bg-blue-500 border-blue-500" : "border-gray-400"
                        }`}
                />
                <span>{nameFiltro}</span>
            </div>
            {activado && (
                children
            )}
        </AccordionContent>
    );
}
