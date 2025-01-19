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
import { InstrumentoExtendido } from "@/types/instrumento"
import { instrumentSchema } from "@/lib/zod"

const formSchema = z.object({
  fechaEntrada: z.string().min(1, {
    message: "La fecha de entrada es requerida.",
  }),
  caratula: z.string().min(1, {
    message: "La carátula es requerida.",
  }),
  destinatario: z.string().min(1, {
    message: "El destinatario es requerido.",
  }),
  direccion: z.string().min(1, {
    message: "La dirección es requerida.",
  }),
  numeroOrden: z.string().min(1, {
    message: "El número de orden es requerido.",
  }),
  identificadorJuzgado: z.string().min(1, {
    message: "El identificador de juzgado es requerido.",
  }),
  tipoInstrumento: z.string().min(1, {
    message: "El tipo de instrumento es requerido.",
  }),
})

interface FormularioInstrumentoProps {
  instrumento?: InstrumentoExtendido
  onSubmit: (data: InstrumentoExtendido) => void
}

export function FormularioInstrumento({ instrumento }: Readonly<FormularioInstrumentoProps>) {
  const form = useForm<z.infer<typeof instrumentSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      entryDate: instrumento?.entryDate.toISOString().split("T")[0] || "",
      caratula: instrumento?.caratula || "",
      destinatario: instrumento?.destinatario || "",
      address: instrumento?.address || "",
      ordenNumber: instrumento?.ordenNumber || "",
      juzgado: instrumento?.juzgado.identifier || "",
      instrumentType: instrumento?.instrumentoType.name || "",
    },
  })

  function handleSubmit(values: z.infer<typeof instrumentSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className=" grid grid-cols-2 gap-6 ">
        <FormField
          control={form.control}
          name="entryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de Entrada</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="exitDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de Salida</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="caratula"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Carátula</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="destinatario"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destinatario</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ordenNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Orden</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="juzgado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Identificador de Juzgado</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instrumentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Instrumento</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{instrumento ? "Actualizar" : "Crear"} Instrumento</Button>
      </form>
    </Form>
  )
}

