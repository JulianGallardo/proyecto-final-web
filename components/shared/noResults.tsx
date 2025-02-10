import { SearchX } from "@mynaui/icons-react";

export default function NoResults(){
    return <div className="flex flex-col w-full justify-center items-center h-64 bg-gray-100 rounded-lg">
              <SearchX className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg font-semibold">No se han encontrado resultados</p>
              <p className="text-gray-400 text-sm">Intenta buscar con otros criterios</p>
            </div>
}