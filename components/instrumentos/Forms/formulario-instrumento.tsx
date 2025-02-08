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
import { InstrumentoDTO } from "@/types/instrumentoTypes"
import { instrumentSchema } from "@/lib/zod"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InstrumentoType, Juzgado, TipoCarga } from "@prisma/client"

interface FormularioInstrumentoProps {
  instrumento?: InstrumentoDTO,
  onSubmit: (data: InstrumentoDTO) => void,
  Juzgados: Juzgado[],
  instrumentoTypes: InstrumentoType[]
}

export function FormularioInstrumento({ instrumento, onSubmit, Juzgados, instrumentoTypes }: Readonly<FormularioInstrumentoProps>) {
  const form = useForm<z.infer<typeof instrumentSchema>>({
    resolver: zodResolver(instrumentSchema),
    defaultValues: {
      entryDate: instrumento?.fecha_de_ingreso.toISOString().split("T")[0] ?? "",
      caratula: instrumento?.caratula ?? "",
      destinatario: instrumento?.destinatario ?? "",
      address: instrumento?.domicilio_denunciado ?? "",
      juzgado: Juzgados.find(juzgado => juzgado.identifier === instrumento?.juzgadoIdentifier)?.identifier ?? "",
      instrumentType: instrumentoTypes.find(instrumentType => instrumentType.identifier === instrumento?.instrumentoTypeIdentifier)?.identifier ?? "",
      observaciones:instrumento?.observaciones ?? ""
    },
  })


  function handleSubmit(values: z.infer<typeof instrumentSchema>) {

    const Juzgado = Juzgados.find(juzgado => juzgado.identifier === values.juzgado)
    const instrumentoType = instrumentoTypes.find(instrumentType => instrumentType.identifier === values.instrumentType)


    const parseDate = (date: string) => {
      const [year, month, day] = date.split("-")
      return new Date(Number(year), Number(month) - 1, Number(day))
    }

    const fecha_de_ingreso_parsed = parseDate(values.entryDate)
    const fecha_de_salida_parsed = values.exitDate ? parseDate(values.exitDate) : null

    console.log(instrumento?.observaciones);

    onSubmit({
      fecha_de_ingreso: fecha_de_ingreso_parsed,
      fecha_de_salida: fecha_de_salida_parsed,
      caratula: values.caratula,
      destinatario: values.destinatario,
      domicilio_denunciado: values.address,
      juzgadoIdentifier: Juzgado?.identifier ?? "",
      instrumentoTypeIdentifier: instrumentoType?.identifier ?? "",
      codigo: instrumento?.codigo ?? "9999999999",
      tipoDeCarga: instrumento?.tipoDeCarga ?? TipoCarga.MAN,
      observaciones: values?.observaciones ?? "",
    })
  }



  return (
    Juzgados.length === 0 || instrumentoTypes.length === 0 ? <div>Cargando...</div> :
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-full  bg-white rounded-lg ">
          <FormField
            control={form.control}
            name="entryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Fecha de Entrada</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none px-3 py-2" />
                </FormControl>
                <FormMessage className="text-sm text-red-500 mt-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="exitDate"
            defaultValue={instrumento?.fecha_de_salida?.toISOString().split("T")[0] ?? ""}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Fecha de Salida</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none px-3 py-2" />
                </FormControl>
                <FormMessage className="text-sm text-red-500 mt-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="caratula"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Carátula</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none px-3 py-2" />
                </FormControl>
                <FormMessage className="text-sm text-red-500 mt-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="destinatario"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Destinatario</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none px-3 py-2" />
                </FormControl>
                <FormMessage className="text-sm text-red-500 mt-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Dirección</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none px-3 py-2" />
                </FormControl>
                <FormMessage className="text-sm text-red-500 mt-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="juzgado"

            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Identificador de Juzgado</FormLabel>
                <FormControl  >
                  <Select value={field.value} onValueChange={field.onChange} defaultValue={field.value} >
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
                </FormControl>
                <FormMessage className="text-sm text-red-500 mt-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="instrumentType"

            render={({ field }) => (
              <FormItem >
                <FormLabel className="text-sm font-medium text-gray-700">Tipo de Instrumento</FormLabel>
                <FormControl className="w-full h-full ">
                  <Select value={field.value} onValueChange={field.onChange} defaultValue={field.value}  >
                    <SelectTrigger className="w-full  border border-gray-300 rounded-md shadow-sm hover:ring focus:ring focus:ring-blue-500 focus:outline-none bg-white px-3 py-2">
                      <SelectValue placeholder="Seleccione un tipo de instrumento" className="text-sm w-full" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 rounded-md shadow-md mt-1" >

                      <SelectGroup >
                        {instrumentoTypes.map((instrumentoType) => (
                          <SelectItem key={instrumentoType.id} value={instrumentoType.identifier} className="flex items-center px-3 py-2 hover:bg-gray-100 focus:bg-gray-200 text-gray-700 cursor-pointer">
                            {instrumentoType.name}
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
                  <Input {...field} className="w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none px-3 py-2" />
                </FormControl>
                <FormMessage className="text-sm text-red-500 mt-1" />
              </FormItem>
            )}
          />
          <div className="col-span-full">
            <Button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md">
              {instrumento ? "Actualizar" : "Crear"} Instrumento
            </Button>
          </div>
        </form>
      </Form>
  )
}


