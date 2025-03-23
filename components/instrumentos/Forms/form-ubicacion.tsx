import { instrumentSchema } from "@/lib/zod";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form"
import AddressAutocomplete from "@/components/planificador-de-ruta/addresAutoComplete";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ExtendedZone } from "@/types/ZoneTypes";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";


interface UbicacionProps {
    form: UseFormReturn<z.infer<typeof instrumentSchema>>,
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    zonas?: ExtendedZone[],
    selectedZona: ExtendedZone | null,
    setSelectedZona: React.Dispatch<React.SetStateAction<ExtendedZone | null>>
}


export default function Ubicacion(
    { form, isOpen, setIsOpen, zonas, selectedZona, setSelectedZona }: Readonly<UbicacionProps>
) {
    return (
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
            <h3 className="col-span-full text-lg font-medium text-gray-800 mb-2">Ubicación</h3>
            <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <FormLabel className="text-sm font-medium text-gray-700">Domicilio</FormLabel>
                        <FormControl>
                            <AddressAutocomplete
                                onChange={(address) => {
                                    form.setValue("address", address)
                                }}
                                setCoords={(lat, long) => {
                                    form.setValue("lat", lat !== null ? Number(lat) : null);
                                    form.setValue("long", long !== null ? Number(long) : null);
                                }}
                                defaultValue={field.value}
                                miUbicacion={false}
                            />
                        </FormControl>
                        <FormMessage className="text-sm text-red-500 mt-1" />
                    </FormItem>
                )}
            />
            {
                zonas &&


                <div className="md:col-span-2">
                    <FormField
                        control={form.control}
                        name="zona"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">Zona</FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value ?? ""}
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            setSelectedZona(zonas.find(zona => zona.zoneName === value) ?? null);
                                            form.setValue("subZona", "");
                                        }}
                                        defaultValue={field.value ?? "automatica"}
                                    >
                                        <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm hover:ring focus:ring focus:ring-blue-500 focus:outline-none bg-white px-3 py-2">
                                            <SelectValue placeholder="Seleccione una zona" className="text-sm" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border border-gray-200 rounded-md shadow-md mt-1">
                                            <SelectGroup>
                                                <SelectItem value="automatica" className="flex items-center px-3 py-2 hover:bg-gray-100 focus:bg-gray-200 text-gray-700 cursor-pointer">
                                                    Zona automática
                                                </SelectItem>
                                                {zonas.map((zona) => (
                                                    <SelectItem key={zona.id} value={zona.zoneName} className="flex items-center px-3 py-2 hover:bg-gray-100 focus:bg-gray-200 text-gray-700 cursor-pointer">
                                                        {zona.zoneName}
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
                        name="subZona"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">Subzona</FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value ?? ""}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value ?? "automatica"}
                                        disabled={!selectedZona}
                                    >
                                        <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm hover:ring focus:ring focus:ring-blue-500 focus:outline-none bg-white px-3 py-2">
                                            <SelectValue placeholder={selectedZona ? "Seleccione una subzona" : "Primero seleccione una zona"} className="text-sm" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border border-gray-200 rounded-md shadow-md mt-1">
                                            <SelectGroup>
                                                {selectedZona && (
                                                    <>
                                                        <SelectItem value="automatica" className="flex items-center px-3 py-2 hover:bg-gray-100 focus:bg-gray-200 text-gray-700 cursor-pointer">
                                                            Subzona automática
                                                        </SelectItem>
                                                        {selectedZona && selectedZona.SubZonas.map((zona) => (
                                                            <SelectItem key={zona.id} value={zona.zoneName} className="flex items-center px-3 py-2 hover:bg-gray-100 focus:bg-gray-200 text-gray-700 cursor-pointer">
                                                                {zona.zoneName}
                                                            </SelectItem>
                                                        ))}
                                                    </>
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage className="text-sm text-red-500 mt-1" />
                            </FormItem>
                        )}
                    />
                </div>
            }

        </div>
    );
}