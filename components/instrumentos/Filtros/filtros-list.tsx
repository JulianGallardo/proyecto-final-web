"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState, useMemo, useCallback } from "react";
import { InstrumentoType, Juzgado } from "@prisma/client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "@mynaui/icons-react";
import { parseDate } from "@/lib/utils";
import ExitDateFilter from "./exit-date-filter";

interface FiltroListProps {
  Juzgados: Juzgado[];
  InstrumentTypes: InstrumentoType[];
  Zonas: string[];
}

export default function FiltrosList({ Juzgados, InstrumentTypes, Zonas }: Readonly<FiltroListProps>) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Configuration of filters
  const filtrosConfig = useMemo(
    () => [
      { param: "desde", displayName: "Desde", type: "date" },
      { param: "hasta", displayName: "Hasta", type: "date" },
      { param: "exitDate", displayName: "Fecha de Salida", type: "custom" },
      { param: "caratula", displayName: "Carátula", type: "text" },
      { param: "address", displayName: "Domicilio", type: "text" },
      { param: "ordenNumber", displayName: "Número de Orden", type: "number" },
      {
        param: "juzgado",
        displayName: "Identificador de Juzgado",
        type: "select",
        options: Juzgados.map((j) => ({ value: j.identifier, label: j.identifier })),
      },
      {
        param: "instrumentType",
        displayName: "Tipo de Instrumento",
        type: "select",
        options: InstrumentTypes.map((i) => ({ value: i.name, label: i.name })),
      },
      { param: "codigo", displayName: "Código", type: "text" },
      {
        param: "urgencia",
        displayName: "Urgencia",
        type: "select",
        options: [{ value: "NORMAL", label: "Normal" }, { value: "URGENTE", label: "Urgente" }],
      },
      {
        param: "estado",
        displayName: "Estado",
        type: "select",
        options: [
          { value: "CORRECCIONES_SOLICITADAS", label: "Correcciones Solicitadas" },
          { value: "PENDIENTE_DE_NOTIFICAR", label: "Pendiente de Notificar" },
          { value: "PENDIENTE_DE_PROCESAR_NOTIFICACION", label: "Pendiente de Procesar Notificación" },
          { value: "NOTIFICADO_VERDE", label: "Notificado Verde" },
          { value: "NOTIFICADO_AMARILLO", label: "Notificado Amarillo" },
          { value: "NOTIFICADO_ROJO", label: "Notificado Rojo" },
        ],
      },
      {
        param: "zona",
        displayName: "Zona",
        type: "select",
        options: Zonas.map((z) => ({ value: z, label: z })),
      },
    ],
    [Juzgados, InstrumentTypes]
  );

  // Memoize filter handling to prevent unnecessary re-renders
  const handleSearch = useCallback((param: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(param, value);
    } else {
      params.delete(param);
    }
    params.set("page", "1");
    replace(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, replace]);

  const clearFilter = useCallback((param: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(param);
    replace(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, replace]);

  const customInputs = useCallback((param: string) => {
    if (param === "exitDate") {
      return <ExitDateFilter param={param} />;
    }
    return (
      <Input
        type={filtrosConfig.find((f) => f.param === param)?.type}
        placeholder={filtrosConfig.find((f) => f.param === param)?.displayName}
        className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm focus:ring focus:ring-blue-500 focus:outline-none"
        onChange={(e) => {
          if (param === "ordenNumber") {
            if (Number(e.target.value) < 0 || isNaN(Number(e.target.value))) {
              e.target.value = "0";
            } else {
              handleSearch(param, e.target.value);
            }
          } else {
            handleSearch(param, e.target.value);
          }
        }}
        defaultValue={searchParams.get(param) ?? ""}
        value={searchParams.get(param) ?? ""} // Controlled input to sync with searchParams
      />
    );
  }, [filtrosConfig, handleSearch, searchParams]);

  const calculateFilterTagValue = useCallback((key: string) => {
    if (key === "desde" || key === "hasta") {
      return parseDate(searchParams.get(key) as string) || "";
    }
    if (key === "exitDate") {
      const value = searchParams.get(key)?.replace(/\+/g, " ");
      return value === "No registrada" ? "No registrada" : parseDate(value as string) || "";
    }
    return searchParams.get(key) || "";
  }, [searchParams]);

  // State for active filters, synced with searchParams
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>(
    Object.fromEntries(filtrosConfig.map((f) => [f.param, !!searchParams.get(f.param)]))
  );

  // Sync activeFilters with searchParams on mount and changes
  useEffect(() => {
    const newActiveFilters = Object.fromEntries(
      filtrosConfig.map((f) => [f.param, !!searchParams.get(f.param)])
    );
    setActiveFilters(newActiveFilters);
  }, [searchParams, filtrosConfig]);

  // Handle filter toggle with debouncing to prevent race conditions
  const toggleFilter = useCallback((param: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [param]: !prev[param],
    }));
    if (activeFilters[param])
      clearFilter(param);

  }, [activeFilters, handleSearch, clearFilter]);

  return (
    <div className="w-full  mx-auto">
      <Accordion
        type="single"
        collapsible
        className="border border-gray-300 rounded-lg shadow-md overflow-hidden"
        defaultValue="filtros" // Default open to prevent unexpected closure
      >
        <AccordionItem value="filtros">
          <AccordionTrigger
            className="flex items-center justify-between px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-t-lg"
          >
            Filtros
          </AccordionTrigger>
          <AccordionContent
            className="p-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            {filtrosConfig.map((filtro) => (
              <Filtro
                key={filtro.param}
                displayName={filtro.displayName}
                isActive={activeFilters[filtro.param]}
                onToggle={() => toggleFilter(filtro.param)}
              >
                {filtro.type === "select" ? (
                  <Select
                    value={searchParams.get(filtro.param) ?? ""}
                    onValueChange={(value) => handleSearch(filtro.param, value)}
                  >
                    <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm bg-white px-3 py-2 hover:ring hover:ring-blue-500 focus:ring focus:ring-blue-500 focus:outline-none">
                      <SelectValue placeholder={`Seleccione ${filtro.displayName}`} className="text-sm text-gray-700" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg">
                      <SelectGroup>
                        {filtro.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="px-3 py-2 hover:bg-blue-100">
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  customInputs(filtro.param)
                )}
              </Filtro>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {Array.from(searchParams.keys())
        .filter((key) => key !== "page")
        .length > 0 && (
          <div className="flex flex-col gap-2 mt-4">
            <span className="text-sm text-gray-800 font-medium">Filtros aplicados:</span>
            <div className="flex flex-wrap gap-2">
              {Array.from(searchParams.keys())
                .filter((key) => key !== "page")
                .map((key) => (
                  <FilterTag
                    key={filtrosConfig.find((f) => f.param === key)?.displayName || key}
                    label={filtrosConfig.find((f) => f.param === key)?.displayName ?? key}
                    value={calculateFilterTagValue(key)}
                    onRemove={() => clearFilter(key)}
                  />
                ))}
            </div>
          </div>
        )}
    </div>
  );
}

interface FilterTagProps {
  label: string;
  value: string;
  onRemove: () => void;
}

export function FilterTag({ label, onRemove, value }: Readonly<FilterTagProps>) {
  return (
    <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1 bg-zinc-700 text-white hover:bg-zinc-800">
      {label}: {value}
      <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent" onClick={onRemove}>
        <X className="h-3 w-3 text-white/70 hover:text-white" />
        <span className="sr-only">Eliminar Filtro</span>
      </Button>
    </Badge>
  );
}

interface FiltroProps {
  displayName: string;
  children: React.ReactNode;
  isActive: boolean;
  onToggle: () => void;
}

function Filtro({ displayName, children, isActive, onToggle }: Readonly<FiltroProps>) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={isActive}
          onClick={onToggle}
          className={`w-5 h-5 border-2 rounded-md ${isActive ? "bg-blue-500 border-blue-500" : "border-gray-400"}`}
        />
        <span className="text-sm text-gray-800 font-medium">{displayName}</span>
      </div>
      {isActive && <div className="mt-2">{children}</div>}
    </div>
  );
}