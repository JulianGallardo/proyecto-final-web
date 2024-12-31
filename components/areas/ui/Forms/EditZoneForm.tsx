import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addNewZoneSchema } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CustomFeature } from "@/types/MapTypes"

interface NewZoneFormProps {
    manageDialog: (open: boolean) => void
    onDialogSubmit: () => void
}

export default function EditZoneForm({ manageDialog, onDialogSubmit }: NewZoneFormProps) {
    const zonesLocalStorage = JSON.parse(window.localStorage.getItem("zones") || "[]")
    const zoneLocalStorage:CustomFeature= zonesLocalStorage[0];
    if (!zoneLocalStorage)
        throw new Error("No se encontró la zona");


    const form = useForm<z.infer<typeof addNewZoneSchema>>({
        resolver: zodResolver(addNewZoneSchema),
        defaultValues: {
            zoneName: zoneLocalStorage.properties.name,
            zoneColor: zoneLocalStorage.properties.color,
            colorOption: "chosen", // Default option is "chosen"
        },
    })

    function registerZone(zone: z.infer<typeof addNewZoneSchema>) {
        const zones = JSON.parse(window.localStorage.getItem("zones") || "[]")
        
        const newZone:CustomFeature = zoneLocalStorage;
        newZone.properties.name = zone.zoneName
        newZone.properties.color = `#${zone.zoneColor.replace(/^#/, '')}`



        zones.push(newZone)
        window.localStorage.setItem("zones", JSON.stringify(zones))
    }

    function onSubmit(values: z.infer<typeof addNewZoneSchema>) {
        registerZone(values)
        onDialogSubmit()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Campo para el nombre de la zona */}
                <FormField
                    control={form.control}
                    name="zoneName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre de la zona</FormLabel>
                            <FormControl>
                                <Input placeholder="Ingresa el nuevo nombre de la zona" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Color Picker */}
                {form.watch("colorOption") === "chosen" && (
                    <FormField
                        control={form.control}
                        name="zoneColor"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Color de la zona</FormLabel>
                                <FormControl>
                                    <input
                                        type="color"
                                        className="w-full h-10 rounded-lg border-0 p-0"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}



                <Button type="submit">Guardar cambios</Button>
            </form>
        </Form>
    )
}
