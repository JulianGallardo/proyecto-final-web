import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { instrumentSchema } from "@/lib/zod";
import { z } from "zod";
import {  UseFormReturn } from "react-hook-form"

export default function InformacionBasica({ form }: Readonly<{ form: UseFormReturn<z.infer<typeof instrumentSchema>> }>) {
    return (
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
            <h3 className="col-span-full text-lg font-medium text-gray-800 mb-2">Información básica</h3>
            <FormField
                control={form.control}
                name="caratula"
                render={({ field }) => (
                    <FormItem className="md:col-span-2">
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
        </div>
    );
}