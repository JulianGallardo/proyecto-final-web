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
import { TypeSchema } from "@/lib/zod"
import { InstrumentoTypeDTO } from "@/types/instrumentoTypes"




interface FormularioTypeProps {
    Type: InstrumentoTypeDTO|null,
    onSubmit: (data: InstrumentoTypeDTO) => void,
    Types: InstrumentoTypeDTO[],
}

export function FormularioType({ Type, onSubmit, Types }: Readonly<FormularioTypeProps>) {
    const form = useForm<z.infer<typeof TypeSchema>>({
        resolver: zodResolver(TypeSchema),
        defaultValues: {
            identifier: Type?.identifier ?? "",
            name: Type?.name ?? "",
        },
    })


    function handleSubmit(values: z.infer<typeof TypeSchema>) {
        onSubmit({
            id: Type?.id ?? 0,
            identifier: values.identifier,
            name: values.name,
            createdAt: Type?.createdAt ?? new Date(),
            updatedAt: new Date(),
        })
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-full  bg-white rounded-lg ">
                <FormField
                    control={form.control}
                    name="identifier"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Identificador</FormLabel>
                            <FormControl>
                                <Input type="string" {...field} className="w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none px-3 py-2" />
                            </FormControl>
                            <FormMessage className="text-sm text-red-500 mt-1" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Nombre</FormLabel>
                            <FormControl>
                                <Input type="string" {...field} className="w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none px-3 py-2" />
                            </FormControl>
                            <FormMessage className="text-sm text-red-500 mt-1" />
                        </FormItem>
                    )}
                />

                <div className="col-span-full">
                    <Button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md">
                        {Type ? "Actualizar" : "Crear"} tipo de instrumento
                    </Button>
                </div>
            </form>
        </Form>
    )
}


