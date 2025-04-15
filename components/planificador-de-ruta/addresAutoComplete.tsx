"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { Input } from "../ui/input";
import { LocateFixed, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useJsApiLoader, Libraries } from "@react-google-maps/api";

const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
const libraries: Libraries = ["places"];

interface AddressAutocompleteProps {
  placeHolder?: string;
  Icon?: React.ElementType;
  onChange: (value: string) => void;
  miUbicacion?: boolean;
  defaultValue?: string;
  setCoords?: (lat: number, lon: number) => void;
  autoFocus?: boolean;
}

export default function AddressAutocomplete({
  placeHolder = "",
  Icon,
  onChange,
  setCoords,
  defaultValue = "",
  miUbicacion = true,
  autoFocus,
}: Readonly<AddressAutocompleteProps>) {
  const [query, setQuery] = useState<string>(defaultValue);
  const [selected, setSelected] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [noResults, setNoResults] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey,
    libraries,
    id: "google-map-script",
  });
  useEffect(() => { setTimeout(() => (document.body.style.pointerEvents = ""), 0); }, []);

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      const bahiaBounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(-39.3, -62.5),
        new window.google.maps.LatLng(-38.65, -61.0)
      );
  
      const auto = new google.maps.places.Autocomplete(inputRef.current, {
        types: ["geocode"],
        componentRestrictions: { country: "AR" },
        bounds: bahiaBounds,
        strictBounds: true,
      });
  
      autocompleteRef.current = auto;
  
      auto.setFields(["formatted_address", "geometry", "name"]);
  
      auto.addListener("place_changed", () => {
        const place = auto.getPlace();
        if (place?.geometry) {
          const lat = place.geometry.location?.lat();
          const lng = place.geometry.location?.lng();
          const address = place.formatted_address || place.name || "";
  
          setQuery(address);
          setSelected(true);
          onChange(address);
          setNoResults(false);
          if (setCoords && lat !== undefined && lng !== undefined) {
            setCoords(lat, lng);
          }
        } else {
          setNoResults(true);
        }
      });
  
      return () => {
       
        if (autocompleteRef.current) {
          google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }
      };
    }
  }, [isLoaded]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelected(false);
    onChange(value);
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
        setIsSearching(true);

        const response = await fetch(url);
        const data = await response.json();
        setIsSearching(false);

        if (data.display_name) {
          const place = data.display_name;

          setQuery(place);
          setSelected(true);
          setNoResults(false);
          onChange(place);

          if (setCoords) {
            setCoords(latitude, longitude);
          }
        } else {
          setNoResults(true);
        }
      } catch (error) {
        setIsSearching(false);
        alert("No se pudo obtener la ubicación: " + (error instanceof Error ? error.message : "Error desconocido"));
      }
    });
  };

  useEffect(() => {
    if (defaultValue && defaultValue !== query) {
      setQuery(defaultValue);
    }
  }, [defaultValue]);

  return (
    <div className="relative w-full z-50">
      <div className="relative flex items-center gap-2">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon className="h-4 w-4 text-gray-500" />
          </span>
        )}

        <Input
          ref={inputRef}
          type="text"
          placeholder={placeHolder}
          className={cn(
            "w-full py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500",
            Icon ? "pl-10" : "",
            miUbicacion ? "pr-10" : ""
          )}
          value={query}
          onChange={handleInputChange}
          autoFocus={autoFocus}
        />

        {miUbicacion && (
          <Button
            onClick={getCurrentLocation}
            disabled={isPending}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            title="Usar mi ubicación"
            type="button"
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
  );
}
