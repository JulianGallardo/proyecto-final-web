import { useEffect, useState, useTransition } from "react";
import { Input } from "../ui/input";
import { useDebouncedCallback } from "use-debounce";
import { LocateFixed, Loader2 } from "lucide-react";
import { Button } from "../ui/button";

interface AddressAutocompleteProps {
    placeHolder?: string;
    Icon?: React.ElementType;
    onChange: (value: string) => void;
    miUbicacion?: boolean;
    defaultValue?: string;
}

interface Place {
    display_name: string;
    address:{
        city: string;
        country: string;
        country_code: string;
        county: string;
        house_number: string;
        postcode: string;
        road: string;
        state: string;
        state_district: string;
        suburb: string;
    }
    lat: number;
    lon: number;
}

interface PlaceResult {
    name: string;
    lat: string;
    lon: string;
}

export default function AddressAutocomplete({
    placeHolder = "",
    Icon,
    onChange,
    defaultValue,
    miUbicacion = true
}: Readonly<AddressAutocompleteProps>) {
    const [query, setQuery] = useState<string>("");
    const [results, setResults] = useState<PlaceResult[]>([]);
    const [selected, setSelected] = useState<boolean>(false);
    const [isPending, startTransition] = useTransition();
    const bbox = "-62.5,-39.0,-61.5,-38.5";

    async function fetchPlaces(searchText: string) {
        if (!searchText) {
            setResults([]);
            return;
        }

        try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}&addressdetails=0&countrycodes=AR&limit=5&bounded=1&viewbox=${bbox}&addressdetails=1`;

            const response = await fetch(url);
            const data = await response.json();

            console.log(data);

            setResults(
                data.map((place: Place) => ({
                    name: place.address.road + " " + place.address.house_number + ", " + place.address.city + ", " + place.address.state + ", " + place.address.country,
                    lat: place.lat.toString(),
                    lon: place.lon.toString(),
                }))
            );
        } catch (error) {
            console.error(error);

        }
    }

    useEffect(() => {
        if (defaultValue) {
            setQuery(defaultValue);
        }
    }, [defaultValue]);

    const handleSearch = useDebouncedCallback(async (searchText: string) => {
        setSelected(false);
        // eslint-disable-next-line sonarjs/void-use
        await fetchPlaces(searchText);
        onChange(searchText);
    }, 300);

    function handleSelectPlace(place: PlaceResult) {
        setQuery(place.name);
        setResults([]);
        setSelected(true);
        onChange(place.name);
    }

    async function getCurrentLocation() {
        // eslint-disable-next-line sonarjs/no-intrusive-permissions
        if (!navigator.geolocation) {
            alert("La geolocalización no es compatible con tu navegador.");
            return;
        }

        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                // eslint-disable-next-line sonarjs/no-intrusive-permissions
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            startTransition(async () => {
                const { latitude, longitude } = position.coords;
                const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
                const response = await fetch(url);
                const data = await response.json();

                if (data.display_name) {
                    setQuery(data.display_name);
                    setSelected(true);
                    onChange(data.display_name);
                }
            });
        } catch (error) {
            alert("No se pudo obtener la ubicación: " + (error instanceof Error ? error.message : 'Error desconocido'));
        }
    }

    return (
        <div className="relative w-full text-gray-400 mx-auto">
            <div className="relative flex items-center">
                {
                    Icon && 
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Icon className="h-4 w-4 text-gray-500" />
                    </div>
                }

                <Input
                    id="search"
                    placeholder={placeHolder}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        handleSearch(e.target.value);
                    }}
                    className={`${Icon ? "pl-10" : ""} h-10 text-black w-full`}
                />
                {miUbicacion && (
                    <Button
                        onClick={async () => {
                            // eslint-disable-next-line sonarjs/void-use
                            await getCurrentLocation();
                        }}
                        className="mx-2 flex items-center p-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                        title="Usar mi ubicación"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <Loader2 className="h-5 w-5 text-gray-600 animate-spin" />
                        ) : (
                            <LocateFixed className="h-5 w-5 text-gray-600" />
                        )}
                    </Button>
                )}
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