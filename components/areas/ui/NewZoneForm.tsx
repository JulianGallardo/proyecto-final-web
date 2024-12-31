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

interface NewZoneFormProps {
  manageDialog: (open: boolean) => void
}

export default function NewZoneForm({ manageDialog }: NewZoneFormProps) {
  const form = useForm<z.infer<typeof addNewZoneSchema>>({
    resolver: zodResolver(addNewZoneSchema),
    defaultValues: {
      zoneName: "",
      zoneColor: "#000000",
      colorOption: "random", // Default option is "chosen"
    },
  })

  function registerZone(zone: z.infer<typeof addNewZoneSchema>) {
    const zones = JSON.parse(window.localStorage.getItem("zones") || "[]")
    const newZone = {
      name: zone.zoneName,
      color: zone.zoneColor,
    }
    zones.push(newZone)
    window.localStorage.setItem("zones", JSON.stringify(zones))
  }

  function onSubmit(values: z.infer<typeof addNewZoneSchema>) {
    if (values.colorOption === "random") {
      values.zoneColor = generateRandomColor()
    }
    registerZone(values)
    manageDialog(false)
  }

  // Function to generate a random color
  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
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
                <Input placeholder="Ingresa el nombre de la nueva zona" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Opción de color */}
        <FormField
          control={form.control}
          name="colorOption"
          defaultValue="random"

          render={({ field }) => (
            <FormItem >
              <FormLabel>Selecciona la opcion del color</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una opción de color" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="random">Random</SelectItem>
                  <SelectItem value="chosen">Color a elección</SelectItem>
                </SelectContent>
              </Select>
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



        <Button type="submit">Crear zona</Button>
      </form>
    </Form>
  )
}
