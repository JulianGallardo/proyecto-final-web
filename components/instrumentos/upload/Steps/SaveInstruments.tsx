"use client"

import { Loader2 } from "lucide-react"

export default function SaveInstrument() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full h-full">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-lg font-medium text-center">Cargando archivos</p>
        <p className="text-sm text-gray-600 text-center">Por favor, no cierres la página</p>
        <div className="mt-4 w-full bg-secondary rounded-full h-2.5">
          <div className="bg-primary h-2.5 rounded-full animate-progress">
            
          </div>
        </div>
    </div>
  )
}