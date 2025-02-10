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
import { editAgenteSchema } from "@/lib/zod"
import { AgenteExtendidoDto, UpdateAgenteDto } from "@/types/agenteTypes"

interface FormularioEditarAgenteProps {
    onSubmit: (data: UpdateAgenteDto) => void
    agente: AgenteExtendidoDto
}


export function FormularioEditarAgente({ agente, onSubmit }: Readonly<FormularioEditarAgenteProps>) {
    const form = useForm<z.infer<typeof editAgenteSchema>>({
        resolver: zodResolver(editAgenteSchema),
        defaultValues: {
            name: agente.user.name,
            lastName: agente.user.lastname,
            email: agente.user.email,
            telefono: parseInt(agente.user.telefono)
        }
    })

    async function handleSubmit(values: z.infer<typeof editAgenteSchema>) {
        values.telefono = parseInt(values.telefono.toString())
        const agenteDto: UpdateAgenteDto = {
            name: values.name,
            lastName: values.lastName,
            email: values.email,
            telefono: values.telefono

        }
        onSubmit(agenteDto)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-full  bg-white rounded-lg ">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Nombre:</FormLabel>
                            <FormControl>
                                <Input type="string" {...field} className="w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none px-3 py-2" />
                            </FormControl>
                            <FormMessage className="text-sm text-red-500 mt-1" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="lastName"

                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Apellido</FormLabel>
                            <FormControl>
                                <Input type="string" {...field} className="w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none px-3 py-2" />
                            </FormControl>
                            <FormMessage className="text-sm text-red-500 mt-1" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"

                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                            <FormControl>
                                <Input type="string" {...field} className="w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none px-3 py-2" />
                            </FormControl>
                            <FormMessage className="text-sm text-red-500 mt-1" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="telefono"

                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Telefono</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} className="w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none px-3 py-2" />
                            </FormControl>
                            <FormMessage className="text-sm text-red-500 mt-1" />
                        </FormItem>
                    )}
                />

                <div className="col-span-full">
                    <Button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md">
                        Editar agente
                    </Button>
                </div>
            </form>
        </Form>
    )
}


