"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { EntregaInstrumentosDto, EntregaInstrumentoUpdateDto } from "@/types/entregasType"
import { loadNewEntregaInstrumentoSchema } from "@/lib/zod"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EstadoEntrega } from "@prisma/client"

interface FormularioNuevaEntregaProps {
    onSubmit: (data: EntregaInstrumentoUpdateDto) => void,
    entrega: EntregaInstrumentosDto | null
}


export function FormularioNuevaEntrega({ entrega, onSubmit }: Readonly<FormularioNuevaEntregaProps>) {
    const form = useForm<z.infer<typeof loadNewEntregaInstrumentoSchema>>({
        resolver: zodResolver(loadNewEntregaInstrumentoSchema),
        defaultValues: entrega ? {
            estado: entrega.estado,
            observaciones: entrega.observaciones
        } : {}
    })

    if (!entrega) return null;

    async function handleSubmit(values: z.infer<typeof loadNewEntregaInstrumentoSchema>) {

        if(!entrega) return;

        const submitEntrega: EntregaInstrumentoUpdateDto = {
            id: entrega?.id,
            estado: values.estado,
            observaciones: values.observaciones,
            instrumento: entrega?.instrumento

        }
        onSubmit(submitEntrega)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-full  bg-white rounded-lg ">




                <FormField
                    control={form.control}
                    name="estado"

                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Estado entrega</FormLabel>
                            <FormControl  >
                                <Select value={field.value} onValueChange={field.onChange} defaultValue={field.value} >
                                    <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm hover:ring focus:ring focus:ring-blue-500 focus:outline-none bg-white px-3 py-2">
                                        <SelectValue placeholder="Seleccione un Juzgado" className="text-sm" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border border-gray-200 rounded-md shadow-md mt-1">
                                        <SelectGroup>
                                            {Object.values(EstadoEntrega).map((estado) => (
                                                <SelectItem key={estado} value={estado} className="text-sm px-3 py-2 hover:bg-gray-50">
                                                    {estado.replace(/_/g, ' ')}
                                                </SelectItem>

                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage className="text-sm text-red-500 mt-1" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="observaciones"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Observaciones</FormLabel>
                            <FormControl>
                                <Input type="string" {...field} value={field.value ?? ''} className="w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none px-3 py-2" />
                            </FormControl>
                            <FormMessage className="text-sm text-red-500 mt-1" />
                        </FormItem>
                    )}
                />

                <div className="col-span-full">
                    <Button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md">
                        Cargar Entrega
                    </Button>
                </div>
            </form>
        </Form>
    )
}


