"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form
} from "@/components/ui/form"
import { InstrumentoDTO } from "@/types/instrumentoTypes"
import { instrumentSchema } from "@/lib/zod"
import { InstrumentoType, Juzgado, TipoCarga, UrgenciaInstrumento } from "@prisma/client"


import { ExtendedZone } from "@/types/ZoneTypes"
import { Observaciones } from "./form-observaciones"
import { InformacionAdministrativa } from "./form-info-admin"
import InformacionBasica from "./form-info-basica"
import Ubicacion from "./form-ubicacion"
import { Loader2 } from "lucide-react"

interface FormularioInstrumentoProps {
  instrumento?: InstrumentoDTO,
  onSubmit: (data: InstrumentoDTO) => Promise<void>,
  Juzgados: Juzgado[],
  instrumentoTypes: InstrumentoType[]
  zonas?: ExtendedZone[]
}






// Componente principal
export function FormularioInstrumento({ instrumento, onSubmit, Juzgados, instrumentoTypes, zonas }: Readonly<FormularioInstrumentoProps>) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedZona, setSelectedZona] = React.useState<ExtendedZone | null>(instrumento?.zona || null)

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
      lat: instrumento?.punto ? instrumento.punto[1] : null,
      long: instrumento?.punto ? instrumento.punto[0] : null,
      zona: instrumento?.zona?.zoneName ?? "",
      subZona: instrumento?.subZona ?? "",
      exitDate: instrumento?.fecha_de_salida?.toISOString().split("T")[0] ?? "",
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

    const latParsed = values.lat ? Number(values.lat) : null;
    const longParsed = values.long ? Number(values.long) : null;

    const instrumentoToSubmit: InstrumentoDTO = {
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
      estado: values.estado,
      punto: (latParsed !== null && longParsed !== null) ? [longParsed, latParsed] as [number, number] : null,
      zona: (zonas?.find(zona => zona.zoneName === values.zona)) || null,
      subZona: values.subZona ?? null
    }

    

    try {
      await onSubmit(
        instrumentoToSubmit
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const buttonText = instrumento ? "Actualizar" : "Crear"

  if (Juzgados.length === 0 || instrumentoTypes.length === 0) {
    return <div>Cargando...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-full bg-white rounded-lg">
        <InformacionBasica form={form} />
        <Ubicacion
          form={form}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          zonas={zonas}
          selectedZona={selectedZona}
          setSelectedZona={setSelectedZona}
        />
        <InformacionAdministrativa form={form} Juzgados={Juzgados} instrumentoTypes={instrumentoTypes} />
        <Observaciones form={form} />
        <div className="col-span-full mt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-600 w-full"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              `${buttonText} Instrumento`
            )}
          </Button>
        </div>

      </form>
    </Form>
  )
}