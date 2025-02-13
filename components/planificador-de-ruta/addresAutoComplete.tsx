import { useState } from "react";
import { Input } from "../ui/input";
import { useDebouncedCallback } from "use-debounce";

interface AddressAutocompleteProps {
    placeHolder?: string;
    Icon?: React.ElementType;
}

export default function AddressAutocomplete({ placeHolder = "", Icon }: Readonly<AddressAutocompleteProps>) {
    const [query, setQuery] = useState<string>(""); // Inicializamos con ""
    const [results, setResults] = useState<{ name: string; lat: string; lon: string }[]>([]);
    const [selected, setSelected] = useState<boolean>(false); // Estado para controlar si se seleccionó un resultado

    async function fetchPlaces(searchText: string) {
        if (!searchText) {
            setResults([]);
            return;
        }

        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}&countrycodes=AR&limit=5`;

        const response = await fetch(url);
        const data = await response.json();

        setResults(
            data.map((place: any) => ({
                name: place.display_name,
                lat: place.lat,
                lon: place.lon,
            }))
        );
    }

    const handleSearch = useDebouncedCallback((searchText: string) => {
        setSelected(false); // Resetear el estado de selección al escribir
        fetchPlaces(searchText);
    }, 300);

    function handleSelectPlace(place: any) {
        setQuery(place.name);
        setResults([]); // Oculta la lista al seleccionar
        setSelected(true); // Indicar que un valor fue seleccionado
    }

    return (
        <div className="relative w-full text-gray-400 mx-auto">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    {Icon && <Icon className="  h-4 w-4 text-gray-500" />}
                </div>
                <Input
                    id="search"
                    placeholder={placeHolder}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value); // Permitir escritura
                        handleSearch(e.target.value);
                    }}
                    className="pl-10 h-10 text-black" 
                />
            </div>

            {!selected && results.length > 0 && (
                <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg z-10 text-black">
                    {results.map((place, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelectPlace(place)}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                            {place.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
