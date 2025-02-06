import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";


interface ExitDateFilterProps {
    param: string;
}

export default function ExitDateFilter({ param }: Readonly<ExitDateFilterProps>) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const options = [
        { value: "No registrada", label: "No registrada" },
        { value: "Registrada", label: "Registrada" }
    ];

    const calculateDefaultValue = searchParams.get(param) && searchParams.get(param) === "No registrada" ? "No registrada" : "Registrada";
    const defaultValue = !searchParams.get(param) ? "" : calculateDefaultValue;


    useEffect(() => {
        if (defaultValue !== "") {
            setSelectedOption(defaultValue);
        }
    }, []);


    // Maneja la búsqueda en los parámetros
    function handleSearch(param: string, value: string | null) {


        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(param, value);
        } else {
            params.delete(param);
        }
        replace(`${pathname}?${params.toString()}`);
    }

    function handleSelectOption(value: string) {
        setSelectedOption(value);
        if (value === "No registrada") {
            handleSearch(param, value);
        }

    }




    return (
        <div className="flex flex-row gap-2">
            <Select
                defaultValue={defaultValue}
                onValueChange={(value) => handleSelectOption(value)}
            >
                <SelectTrigger className="w-full h-full border border-gray-300 rounded-md ">
                    <SelectValue placeholder={"Seleccione una fecha de salida"} className="text-sm text-gray-700" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg">
                    <SelectGroup>
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="px-3 py-2 hover:bg-blue-100">
                                {option.label}
                            </SelectItem>
                        ))}

                    </SelectGroup>
                </SelectContent>

            </Select>
            {
                selectedOption === "Registrada" && (
                    <input type="date" className="w-fit border border-gray-300 rounded-md shadow-sm bg-white px-3 py-2 hover:ring hover:ring-blue-500 focus:ring focus:ring-blue-500 focus:outline-none"
                        onChange={(e) => handleSearch(param, e.target.value)}
                        defaultValue={searchParams.get(param) ?? ""}
                    />
                )

            }
        </div>

    )
}