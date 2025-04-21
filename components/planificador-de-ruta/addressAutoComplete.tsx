"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import ReactDOM from "react-dom";
import { Input } from "../ui/input";
import { useDebouncedCallback } from "use-debounce";
import { LocateFixed, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface AddressAutocompleteProps {
  placeHolder?: string;
  Icon?: React.ElementType;
  onChange: (value: string) => void;
  miUbicacion?: boolean;
  defaultValue?: string;
  setCoords?: (lat: number, lon: number) => void;
  autoFocus?: boolean;
}

interface Place {
  display_name: string;
  address: {
    city: string;
    country: string;
    road: string;
    house_number: string;
    state: string;
  };
  lat: number;
  lon: number;
}

interface PlaceResult {
  name: string;
  lat: string;
  lon: string;
}

export default function AddressAutoComplete({
  placeHolder = "",
  Icon,
  onChange,
  setCoords,
  defaultValue = "",
  miUbicacion = true,
  autoFocus = false,
}: Readonly<AddressAutocompleteProps>) {
  const [query, setQuery] = useState<string>(defaultValue);
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [selected, setSelected] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [noResults, setNoResults] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  const bbox = "-62.5,-39.0,-61.5,-38.5";

  const fetchPlaces = async (searchText: string, controller: AbortController) => {
    if (!searchText) {
      setResults([]);
      setNoResults(false);
      return;
    }

    setIsSearching(true);
    setNoResults(false);

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        searchText
      )}&addressdetails=1&countrycodes=AR&limit=5&bounded=1&viewbox=${bbox}`;

      const response = await fetch(url, { signal: controller.signal });
      const data: Place[] = await response.json();

      const mappedResults = data.map((place) => ({
        name: [place.address.road, place.address.house_number, place.address.city, place.address.state, place.address.country]
          .filter(Boolean)
          .join(", "),
        lat: place.lat.toString(),
        lon: place.lon.toString(),
      }));

      setResults(mappedResults);
      setNoResults(mappedResults.length === 0);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("Error fetching places:", error);
      setNoResults(true);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  const handleSearch = useDebouncedCallback((searchText: string) => {
    const controller = new AbortController();
    fetchPlaces(searchText, controller);
    onChange(searchText);
    return () => controller.abort();
  }, 500);

  const handleSelectPlace = (place: PlaceResult) => {
    setQuery(place.name);
    setResults([]);
    setSelected(true);
    setNoResults(false);
    onChange(place.name);
    if (setCoords) setCoords(parseFloat(place.lat), parseFloat(place.lon));
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("La geolocalización no es compatible con tu navegador.");
      return;
    }

    startTransition(async () => {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
        );
        const { latitude, longitude } = position.coords;
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.display_name) {
          const addressComponents = [data.address.road, data.address.house_number, data.address.city, data.address.state, data.address.country];
          const place = addressComponents.filter(Boolean).join(", ");
          setQuery(place);
          setSelected(true);
          setNoResults(false);
          onChange(place);
        }
      } catch (error) {
        alert("No se pudo obtener la ubicación: " + (error instanceof Error ? error.message : "Error desconocido"));
      }
    });
  };

  useEffect(() => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
    }
  }, [results.length, isSearching, query]);

  const dropdown = results.length > 0 && query && !isSearching && (
    <ul
      className={cn(
        "rounded-md border border-gray-200 bg-white shadow-lg",
        "max-h-60 overflow-y-auto text-gray-900 text-sm",
        "z-[9999] absolute"
      )}
      style={{
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
        position: "absolute",
      }}
    >
      {results.map((place, index) => (
        <li
          key={index}
          onClick={() => handleSelectPlace(place)}
          className={cn(
            "px-4 py-2 cursor-pointer truncate",
            "hover:bg-gray-50 hover:text-blue-600",
            "border-b border-gray-100 last:border-b-0"
          )}
        >
          {place.name}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <div className="relative w-full mx-auto text-gray-400">
        <div className="relative flex items-center gap-2">
          {Icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Icon className="h-4 w-4 text-gray-500" />
            </span>
          )}

          <Input
            ref={inputRef}
            id="search"
            placeholder={placeHolder}
            value={query}
            onChange={(e) => {
              const newValue = e.target.value;
              setQuery(newValue);
              if (selected && newValue !== query) {
                setSelected(false);
              }
              handleSearch(newValue);
            }}
            className={cn(
              `${Icon ? "pl-10" : "pl-3"} h-10 w-full text-black`,
              "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
            )}
            autoFocus={autoFocus}
          />

          {isSearching && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 text-gray-500 animate-spin" />
            </div>
          )}

          {miUbicacion && (
            <Button
              onClick={getCurrentLocation}
              disabled={isPending}
              className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
              title="Usar mi ubicación"
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 text-gray-600 animate-spin" />
              ) : (
                <LocateFixed className="h-5 w-5 text-gray-600" />
              )}
            </Button>
          )}
        </div>

        {noResults && !isSearching && (
          <div className="w-full p-2">
            <p className="text-sm text-red-500">No se encontraron resultados.</p>
          </div>
        )}
      </div>

      {/* Portal renderizado al final del body */}
      {ReactDOM.createPortal(dropdown, document.body)}
    </>
  );
}
