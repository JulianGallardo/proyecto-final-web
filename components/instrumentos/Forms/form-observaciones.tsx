import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { instrumentSchema } from "@/lib/zod";
import { z } from "zod";
import {  UseFormReturn } from "react-hook-form"


export function Observaciones(
    { form }: Readonly<{ form: UseFormReturn<z.infer<typeof instrumentSchema>>}>
) {



    return (
        <div className="md:col-span-2 border-b pb-6">
            <FormField
                control={form.control}
                name="observaciones"
                render={({ field }) => (
                    <FormItem className="col-span-full">
                        <FormLabel className="text-sm font-medium text-gray-700">Observaciones</FormLabel>
                        <FormControl>
                            <Input {...field} className="w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none px-3 py-2" />
                        </FormControl>
                        <FormMessage className="text-sm text-red-500 mt-1" />
                    </FormItem>
                )}
            />
        </div>
    );

}