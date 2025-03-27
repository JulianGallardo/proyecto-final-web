import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UrgenciaInstrumento, EstadoInstrumento, Juzgado, InstrumentoType } from "@prisma/client";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { instrumentSchema } from "@/lib/zod";
import { z } from "zod";

export function  InformacionAdministrativa (
    {form, Juzgados, instrumentoTypes}: Readonly<{form: UseFormReturn<z.infer<typeof instrumentSchema>>, Juzgados: Juzgado[], instrumentoTypes: InstrumentoType[]}>
){
    return(
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
          <h3 className="col-span-full text-lg font-medium text-gray-800 mb-2">Información administrativa</h3>
          <FormField
            control={form.control}
            name="juzgado"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Identificador de Juzgado</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange} defaultValue={field.value}>
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
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Tipo de Instrumento</FormLabel>
                <FormControl className="w-full h-full">
                  <Select value={field.value} onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm hover:ring focus:ring focus:ring-blue-500 focus:outline-none bg-white px-3 py-2">
                      <SelectValue placeholder="Seleccione un tipo de instrumento" className="text-sm w-full" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 rounded-md shadow-md mt-1">
                      <SelectGroup>
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
            name="urgencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Urgencia</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Select value={field.value} onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm hover:ring focus:ring focus:ring-blue-500 focus:outline-none bg-white px-3 py-2">
                      <SelectValue placeholder="Seleccione un estado" className="text-sm" />
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
        </div>
      );
} 