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
import { CustomFeature } from "@/types/MapTypes"
import { useEffect, useState } from "react"

interface NewZoneFormProps {
    manageDialog: (open: boolean) => void
    onDialogSubmit: () => void
}

export default function EditZoneForm({  onDialogSubmit }: NewZoneFormProps) {
    const [zoneLocalStorage, setZoneLocalStorage] = useState<CustomFeature | null>(null);

    const form = useForm<z.infer<typeof addNewZoneSchema>>({
        resolver: zodResolver(addNewZoneSchema),
        defaultValues: {
            zoneName: zoneLocalStorage?.properties.name,
            zoneColor: zoneLocalStorage?.properties.color,
            colorOption: "chosen", // Default option is "chosen"
        },
    })
    

    useEffect(() => {
        const zonesLocalStorage = JSON.parse(window.localStorage.getItem("zones") ?? "[]");
        if (zonesLocalStorage.length === 0) {
            return;
        }

        const zone: CustomFeature = zonesLocalStorage[0];
        setZoneLocalStorage(zone)
        form.setValue("zoneName", zone.properties.name)
        form.setValue("zoneColor", zone.properties.color)
        window.localStorage.removeItem("zones");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window.localStorage.getItem("zones")])



    function registerZone(zone: z.infer<typeof addNewZoneSchema>) {
        const zones = JSON.parse(window.localStorage.getItem("zones") ?? "[]")

        if (zoneLocalStorage === null) {
            throw new Error("La zona es nula");
        }
        const newZone: CustomFeature = {
            id: zoneLocalStorage.id,
            type: "Feature",
            properties: {
                name: zone.zoneName,
                color: `#${zone.zoneColor.replace(/^#/, '')}`,
            },
            geometry: zoneLocalStorage.geometry

        }
        zones.push(newZone)
        window.localStorage.setItem("zones", JSON.stringify(zones))
    }

    function onSubmit(values: z.infer<typeof addNewZoneSchema>) {
        registerZone(values)
        onDialogSubmit()
    }

    return (
        zoneLocalStorage &&
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
