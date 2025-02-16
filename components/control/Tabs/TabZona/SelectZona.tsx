'use client'

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react';


interface SelectComponentProps {
    zoneNames: string[];
    defaultValue?: string;
}

export default function SelectZona({ zoneNames, defaultValue }: Readonly<SelectComponentProps>) {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Función para manejar la selección
    const handleSelectChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())

        params.set('zoneName', value)


        router.push(`?${params.toString()}`) // Actualiza la URL sin recargar la página
    }

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete('zoneName')
        params.delete('agenteId')
        return () => {
            const params = new URLSearchParams(searchParams.toString())
            params.delete('zoneName')
            params.delete('agenteId')
            router.push(`?${params.toString()}`)
        };
    }, []);

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Selecciona un zona</h1>

            <Select onValueChange={handleSelectChange} defaultValue={defaultValue}>
                <SelectTrigger className="w-64">
                    <SelectValue placeholder="Selecciona una opción" />
                </SelectTrigger>
                <SelectContent>
                    {zoneNames.map((option) => (
                        <SelectItem key={option} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
