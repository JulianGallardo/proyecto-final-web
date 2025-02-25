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
import {  updateMesaEntradaSchema } from "@/lib/zod"
import { Prisma, Role, User } from "@prisma/client"




interface FormularioNuevoAgenteProps {
  onSubmit: (data: Prisma.UserUpdateInput) => void
  personal: User
}

export function FormularioActualizarMesaEntrada({ onSubmit,personal }: Readonly<FormularioNuevoAgenteProps>) {
  const form = useForm<z.infer<typeof updateMesaEntradaSchema>>({
    resolver: zodResolver(updateMesaEntradaSchema),
    defaultValues: {
      name: personal.name ?? '',
      lastName: personal.lastname ?? '',
      email: personal.email,
      telefono: personal.telefono ? Number(personal.telefono) : undefined
    }
  })



  function handleSubmit(values: z.infer<typeof updateMesaEntradaSchema>) {
    values.telefono = parseInt(values.telefono.toString())
    onSubmit(
      {
        name: values.name,
        lastname: values.lastName,
        email: values.email,
        telefono: values.telefono,
        role: Role.mesa_de_entrada
      }
    )
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
            Actualizar mesa de entrada
          </Button>
        </div>
      </form>
    </Form>
  )
}


