"use client";

import { useEffect, useState, useRef } from "react";
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, Portal } from "@headlessui/react";
import { LocateFixed, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useDebouncedCallback } from "use-debounce";

interface AddressAutocompleteProps {
  placeHolder?: string;
  onChange: (value: string) => void;
  setCoords?: (lat: number, lon: number) => void;
  defaultValue?: string;
  miUbicacion?: boolean;
  autoFocus?: boolean;
  inTable?: boolean;
}

interface PlaceResult {
  name: string;
  lat: string;
  lon: string;
}

interface RawPlace {
  address: {
    road?: string;
    house_number?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  lat: string | number;
  lon: string | number;
}

export default function AddressAutoComplete({
  placeHolder = "",
  onChange,
  setCoords,
  defaultValue = "",
  miUbicacion = true,
  autoFocus = false,
  inTable = false,
}: Readonly<AddressAutocompleteProps>) {
  const [query, setQuery] = useState(defaultValue);
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  const bbox = "-62.5,-39.0,-61.5,-38.5";

  const formatPlaceName = (address: RawPlace["address"]): string => {
    return [
      address.road,
      address.house_number,
      address.city,
      address.state,
      address.country,
    ]
      .filter(Boolean)
      .join(", ");
  };

  const handleSelectPlace = (place: PlaceResult) => {
    setQuery(place.name);
    setResults([]);
    onChange(place.name);
    console.log("Selected place:", place.name);
    console.log("Selected coordinates:", place.lat, place.lon);
    if (setCoords) setCoords(parseFloat(place.lat), parseFloat(place.lon));
  };

  const fetchPlaces = async (searchText: string) => {
    if (!searchText) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        searchText
      )}&addressdetails=1&countrycodes=AR&limit=5&bounded=1&viewbox=${bbox}`;

      const response = await fetch(url);
      const data: RawPlace[] = await response.json();

      const mapped: PlaceResult[] = data.map((place) => ({
        name: formatPlaceName(place.address),
        lat: place.lat.toString(),
        lon: place.lon.toString(),
      }));

      setResults(mapped);
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useDebouncedCallback((text: string) => {
    fetchPlaces(text);
    onChange(text);
  }, 500);

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      console.warn("Geolocalización no soportada por este navegador.");
      return;
    }

    setIsPending(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) =>
        // eslint-disable-next-line 
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );

      const { latitude, longitude } = position.coords;

      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.address) {
        const placeName = formatPlaceName(data.address);
        setQuery(placeName);
        onChange(placeName);
      }

      if (setCoords) {
        setCoords(latitude, longitude);
      }
    } catch (error) {
      console.error("Error obteniendo ubicación:", error);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  // Update dropdown position when input changes or results appear
  useEffect(() => {
    if (inputRef.current && inTable && results.length > 0) {
      const rect = inputRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [inputRef, results, inTable, query]);

  return (
    <Combobox value={query} onChange={(value: string) => {
      setQuery(value);
      onChange(value);
      handleSelectPlace(results.find((place) => place.name === value) || { name: "", lat: "", lon: "" });
    }}>
      <div className="relative w-full">
        <div className="flex gap-2">
          <ComboboxInput
            as={Input}
            ref={inputRef}
            className="w-full"
            placeholder={placeHolder}
            displayValue={(val: string) => val}
            onChange={(e) => {
              const newQuery = e.target.value;
              setQuery(newQuery);
              handleSearch(newQuery);
            }}
            autoFocus={autoFocus}
          />
          {miUbicacion && (
            <Button
              type="button"
              onClick={getCurrentLocation}
              disabled={isPending}
              className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 text-gray-600 animate-spin" />
              ) : (
                <LocateFixed className="h-5 w-5 text-gray-600" />
              )}
            </Button>
          )}
        </div>

        {(results.length > 0 && !inTable) && (
          <ComboboxOptions className="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg max-h-60 overflow-y-auto border border-gray-200 text-sm">
            {results.map((place, idx) => (
              <ComboboxOption
                key={idx}
                value={place.name}
                className={({ active }) =>
                  cn(
                    "px-4 py-2 cursor-pointer truncate",
                    active ? "bg-gray-100 text-blue-600" : "text-gray-900"
                  )
                }

              >
                {place.name}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        )}
        
        {(results.length > 0 && inTable) && (
          <Portal>
            <div 
              style={{
                position: 'absolute',
                top: `${position.top}px`,
                left: `${position.left}px`,
                width: `${position.width}px`,
                zIndex: 50
              }}
            >
              <ComboboxOptions className="rounded-md bg-white shadow-lg max-h-60 overflow-y-auto border border-gray-200 text-sm">
                {results.map((place, idx) => (
                  <ComboboxOption
                    key={idx}
                    value={place.name}
                    className={({ active }) =>
                      cn(
                        "px-4 py-2 cursor-pointer truncate",
                        active ? "bg-gray-100 text-blue-600" : "text-gray-900"
                      )
                    }
                  >
                    {place.name}
                  </ComboboxOption>
                ))}
              </ComboboxOptions>
            </div>
          </Portal>
        )}

        {loading && (
          <div className="absolute right-2 top-2">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        )}
      </div>
    </Combobox>
  );
}