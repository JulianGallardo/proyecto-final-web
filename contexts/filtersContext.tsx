"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Helper function to get section path (extrae la sección principal de la URL)
function getSectionPath(path: string): string {
  // Extrae el primer segmento de la ruta (ej: /instrumentos/123 -> /instrumentos)
  const firstSegment = path.split('/').filter(Boolean)[0];
  return firstSegment ? `/${firstSegment}` : path;
}

export type FilterOption = {
  value: string;
  label: string;
};

export type FilterConfig = {
  param: string;
  displayName: string;
  type: "text" | "date" | "select" | "number" | "custom";
  options?: FilterOption[];
};

type FilterContextType = {
  filters: Record<string, string>;
  filterConfigs: FilterConfig[];
  setFilterConfigs: (configs: FilterConfig[]) => void;
  applyFilter: (param: string, value: string | null) => void;
  clearFilter: (param: string) => void;
  clearAllFilters: () => void;
  isFilterActive: (param: string) => boolean;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [filterConfigs, setFilterConfigs] = useState<FilterConfig[]>([]);
  const [initialized, setInitialized] = useState(false);
  
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  // Obtenemos la sección principal de la ruta para agrupar filtros
  const sectionPath = getSectionPath(pathname);



  // Efecto para cargar filtros guardados
  useEffect(() => {
    if (!initialized) {
      try {
        // Intentar cargar filtros desde localStorage por sección
        const savedFilters = localStorage.getItem(`app-filters-${sectionPath}`);

        console.log(sectionPath);
        
        if (savedFilters) {
          const parsedFilters = JSON.parse(savedFilters);
          setFilters(parsedFilters);
          
          // Solo restaurar en URL si no hay filtros ya aplicados o estamos en página inicial
          const params = new URLSearchParams(searchParams.toString());
          let changed = false;
          
          // Solo restauramos filtros de URL si no hay parámetros ya presentes
          // o si acabamos de navegar a una nueva página en la misma sección
          if (params.toString() === '' || (params.has('page') && Array.from(params.keys()).length === 1)) {
            Object.entries(parsedFilters).forEach(([key, value]) => {
              if (value) {
                params.set(key, value as string);
                changed = true;
              }
            });
            
            if (changed) {
              replace(`${pathname}?${params.toString()}`);
            }
          }
        }
      } catch (error) {
        console.error("Error cargando filtros guardados:", error);
      }
      
      setInitialized(true);
    }
  }, [initialized, pathname, replace, searchParams, sectionPath]);

  // Efecto para sincronizar URL con estado
  useEffect(() => {
    if (initialized) {
      // Extrae filtros de la URL
      const urlFilters: Record<string, string> = {};
      Array.from(searchParams.entries()).forEach(([key, value]) => {
        if (key !== "page") {
          urlFilters[key] = value;
        }
      });
      
      // Actualiza el estado con los filtros de la URL
      setFilters(urlFilters);
      
      // Guarda en localStorage por sección
      if (Object.keys(urlFilters).length > 0) {
        localStorage.setItem(`app-filters-${sectionPath}`, JSON.stringify(urlFilters));
      }
    }
  }, [searchParams, initialized, sectionPath]);

  const applyFilter = (param: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(param, value);
    } else {
      params.delete(param);
    }
    
    // Resetear a página 1 cuando se aplica un filtro
    params.set("page", "1");
    replace(`${pathname}?${params}`);
  };

  const clearFilter = (param: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(param);
    replace(`${pathname}?${params}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    params.set("page", "1");
    replace(`${pathname}?${params}`);
    localStorage.removeItem(`app-filters-${sectionPath}`);
  };

  const isFilterActive = (param: string) => {
    return searchParams.has(param);
  };

  const contextValue = useMemo(() => ({
    filters,
    filterConfigs,
    setFilterConfigs,
    applyFilter,
    clearFilter,
    clearAllFilters,
    isFilterActive,
  }), [filters, filterConfigs, setFilterConfigs, applyFilter, clearFilter, clearAllFilters, isFilterActive]);

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilters debe usarse dentro de un FilterProvider");
  }
  return context;
}