'use client' // Los componentes de error deben ser Client Components

import { Button } from "@/components/ui/button"
import { useEffect } from "react"

const ErrorIcon = () => (
  <svg
    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 text-red-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
)

export default function ErrorNotFound({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string }
  reset: () => void
}>) {

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center ">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-md w-full text-center items-center justify-center">
        <ErrorIcon />
        <h1 className="text-3xl sm:text-4xl font-bold text-red-600 mb-2 sm:mb-4">¡Ups!</h1>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">Algo salió mal</h2>
        <p className="text-gray-600 mb-6">
          Pedimos disculpas por las molestias.
          <br />
          {
            error.name 
          }
          <br />
          {
            error.message
          }
          
        </p>
        <div className="space-y-3 sm:space-y-4">
          <Button 
            onClick={()=>reset()}
            className="w-full"
          >
            Intentar de nuevo
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/inicio'}
            className="w-full"
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  )
}

