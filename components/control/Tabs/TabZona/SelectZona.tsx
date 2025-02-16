'use client'

import { AgenteExtendidoDto } from '@/types/agenteTypes';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useRouter, useSearchParams } from 'next/navigation'


interface SelectComponentProps {
    zoneNames: string[];
    defaultValue?: string;
}

export default function SelectZona({ zoneNames,defaultValue }: Readonly<SelectComponentProps>) {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Función para manejar la selección
    const handleSelectChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())

        params.set('zoneName', value)


        router.push(`?${params.toString()}`) // Actualiza la URL sin recargar la página
    }

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
