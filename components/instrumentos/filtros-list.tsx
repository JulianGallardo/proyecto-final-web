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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@radix-ui/react-select"


interface FiltroListProps {
    Juzgados: Juzgado[],
    InstrumentTypes: InstrumentoType[]
}


export default function FiltrosList({ Juzgados, InstrumentTypes }: Readonly<FiltroListProps>) {
    return (
        <Accordion
            type="single"
            collapsible
            className="border border-gray-200 rounded-lg shadow-sm"
        >
            <AccordionItem value="item-1" className="overflow-hidden ">
                <AccordionTrigger className="flex items-center justify-between px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium">
                    Filtros
                </AccordionTrigger>
                <AccordionContent className="px-4 py-3 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
                    <Filtro nameFiltro="Fecha de Entrada"  >
                        <Input
                            type="date"
                            className="w-full"
                            placeholder="Fecha de Entrada"
                        />
                    </Filtro>
                    <Filtro nameFiltro="Fecha de Salida" >
                        <Input
                            type="date"
                            className="w-full"
                            placeholder="Fecha de Salida"
                        />
                    </Filtro>
                    <Filtro nameFiltro="Carátula" >
                        <Input
                            type="text"
                            className="w-full"
                            placeholder="Carátula"
                        />
                    </Filtro>
                    <Filtro nameFiltro="Destinatario" >
                        <Input
                            type="text"
                            className="w-full"
                            placeholder="Destinatario"
                        />
                    </Filtro>
                    <Filtro nameFiltro="Dirección" >
                        <Input
                            type="text"
                            className="w-full"
                            placeholder="Dirección"
                        />
                    </Filtro>
                    <Filtro nameFiltro="Número de Orden" >
                        <Input
                            type="text"
                            className="w-full"
                            placeholder="Número de Orden"
                        />
                    </Filtro>
                    <Filtro nameFiltro="Identificador de Juzgado" >
                        <Select   >
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
                        <Select   >
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
        <AccordionContent className="flex items-center space-x-3 px-4 ">
            <Checkbox
                checked={activado}
                onClick={() => setActivado(!activado)}
                className={`w-5 h-5 border-2 rounded-md ${activado ? "bg-blue-500 border-blue-500" : "border-gray-400"
                    }`}
            />
            <span>{nameFiltro}</span>
            {activado && (
                children
            )}
        </AccordionContent>
    );
}
