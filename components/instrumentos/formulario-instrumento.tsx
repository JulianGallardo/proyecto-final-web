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
import { Instrumento } from "@/types/instrumento"

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
  instrumento?: Instrumento
  onSubmit: (data: Instrumento) => void
}

export function FormularioInstrumento({ instrumento, onSubmit }: FormularioInstrumentoProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: instrumento ? {
      ...instrumento,
      fechaEntrada: instrumento.fechaEntrada.toISOString().split('T')[0],
    } : {
      fechaEntrada: new Date().toISOString().split('T')[0],
      caratula: "",
      destinatario: "",
      direccion: "",
      numeroOrden: "",
      identificadorJuzgado: "",
      tipoInstrumento: "",
    },
  })

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit({
      id: instrumento?.id || Date.now().toString(),
      ...values,
      fechaEntrada: new Date(values.fechaEntrada),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="fechaEntrada"
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
          name="direccion"
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
          name="numeroOrden"
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
          name="identificadorJuzgado"
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
          name="tipoInstrumento"
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

