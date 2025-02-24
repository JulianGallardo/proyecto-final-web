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
import { EstadoInstrumento, InstrumentoType, Juzgado, TipoCarga, UrgenciaInstrumento } from "@prisma/client"
import AddressAutocomplete from "@/components/planificador-de-ruta/addresAutoComplete"
import { Loader2 } from "lucide-react"

interface FormularioInstrumentoProps {
  instrumento?: InstrumentoDTO,
  onSubmit: (data: InstrumentoDTO) => Promise<void>,
  Juzgados: Juzgado[],
  instrumentoTypes: InstrumentoType[]
}

export function FormularioInstrumento({ instrumento, onSubmit, Juzgados, instrumentoTypes }: Readonly<FormularioInstrumentoProps>) {

  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const form = useForm<z.infer<typeof instrumentSchema>>({
    resolver: zodResolver(instrumentSchema),
    defaultValues: {
      entryDate: instrumento?.fecha_de_ingreso.toISOString().split("T")[0] ?? "",
      caratula: instrumento?.caratula ?? "",
      urgencia: instrumento?.urgencia ?? UrgenciaInstrumento.NORMAL,
      address: instrumento?.domicilio_denunciado ?? "",
      juzgado: Juzgados.find(juzgado => juzgado.identifier === instrumento?.juzgadoIdentifier)?.identifier ?? "",
      instrumentType: instrumentoTypes.find(instrumentType => instrumentType.identifier === instrumento?.instrumentoTypeIdentifier)?.identifier ?? "",
      observaciones: instrumento?.observaciones ?? "",
      estado: instrumento?.estado as "CORRECCIONES_SOLICITADAS" | "PENDIENTE_DE_NOTIFICAR" | undefined ?? "PENDIENTE_DE_NOTIFICAR",
     
    },
  })


  async function handleSubmit(values: z.infer<typeof instrumentSchema>) {
    setIsSubmitting(true)
    const Juzgado = Juzgados.find(juzgado => juzgado.identifier === values.juzgado)
    const instrumentoType = instrumentoTypes.find(instrumentType => instrumentType.identifier === values.instrumentType)


    const parseDate = (date: string) => {
      const [year, month, day] = date.split("-")
      return new Date(Number(year), Number(month) - 1, Number(day))
    }

    const fecha_de_ingreso_parsed = parseDate(values.entryDate)
    const fecha_de_salida_parsed = values.exitDate ? parseDate(values.exitDate) : null

    try {
      await onSubmit({
        fecha_de_ingreso: fecha_de_ingreso_parsed,
        fecha_de_salida: fecha_de_salida_parsed,
        caratula: values.caratula,
        urgencia: values.urgencia,
        domicilio_denunciado: values.address,
        juzgadoIdentifier: Juzgado?.identifier ?? "",
        instrumentoTypeIdentifier: instrumentoType?.identifier ?? "",
        codigo: instrumento?.codigo ?? "9999999999",
        tipoDeCarga: instrumento?.tipoDeCarga ?? TipoCarga.MAN,
        observaciones: values?.observaciones ?? "",
        estado: values.estado
      })
    } finally {
      setIsSubmitting(false)
    }

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
            name="urgencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Urgencia</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange} defaultValue={field.value} >
                    <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm hover:ring focus:ring focus:ring-blue-500 focus:outline-none bg-white px-3 py-2">
                      <SelectValue placeholder="Seleccione una Urgencia" className="text-sm" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 rounded-md shadow-md mt-1">
                      <SelectGroup>
                        <SelectItem value={UrgenciaInstrumento.NORMAL} className="flex items-center px-3 py-2 hover:bg-gray-100 focus:bg-gray-200 text-gray-700 cursor-pointer">
                          Normal
                        </SelectItem>
                        <SelectItem value={UrgenciaInstrumento.URGENTE} className="flex items-center px-3 py-2 hover:bg-gray-100 focus:bg-gray-200 text-gray-700 cursor-pointer">
                          Urgente
                        </SelectItem>
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
            name="estado"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Estado</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange} defaultValue={field.value} >
                    <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm hover:ring focus:ring focus:ring-blue-500 focus:outline-none bg-white px-3 py-2">
                      <SelectValue placeholder="Seleccione una Urgencia" className="text-sm" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 rounded-md shadow-md mt-1">
                      <SelectGroup>
                        <SelectItem value={EstadoInstrumento.CORRECCIONES_SOLICITADAS} className="flex items-center px-3 py-2 hover:bg-gray-100 focus:bg-gray-200 text-gray-700 cursor-pointer">
                          Correcciones Solicitadas
                        </SelectItem>
                        <SelectItem value={EstadoInstrumento.PENDIENTE_DE_NOTIFICAR} className="flex items-center px-3 py-2 hover:bg-gray-100 focus:bg-gray-200 text-gray-700 cursor-pointer">
                          Listo para notificar
                        </SelectItem>
                        <SelectItem value={EstadoInstrumento.PENDIENTE_DE_PROCESAR_NOTIFICACION} className="flex items-center px-3 py-2 hover:bg-gray-100 focus:bg-gray-200 text-gray-700 cursor-pointer">
                          Pendiente de Procesar Notificación
                        </SelectItem>
                        <SelectItem value={EstadoInstrumento.NOTIFICADO_VERDE} className="flex items-center px-3 py-2 hover:bg-gray-100 focus:bg-gray-200 text-gray-700 cursor-pointer">
                          Notificado Verde
                        </SelectItem>
                        <SelectItem value={EstadoInstrumento.NOTIFICADO_AMARILLO} className="flex items-center px-3 py-2 hover:bg-gray-100 focus:bg-gray-200 text-gray-700 cursor-pointer">
                          Notificado Amarillo
                        </SelectItem>
                        <SelectItem value={EstadoInstrumento.NOTIFICADO_ROJO} className="flex items-center px-3 py-2 hover:bg-gray-100 focus:bg-gray-200 text-gray-700 cursor-pointer">
                          Notificado Rojo
                        </SelectItem>
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
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Domicilio</FormLabel>
                <FormControl>
                  <AddressAutocomplete onChange={
                    (address) => {
                      form.setValue("address", address)
                    }
                  }

                    defaultValue={field.value}
                    miUbicacion={false}
                  />
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
          <div className="col-span-full ">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600 w-full"
            >
              {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                `${instrumento ? "Actualizar" : "Crear"} Instrumento`
              )}
            </Button>
          </div>
        </form>
      </Form>
  )
}


