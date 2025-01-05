import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Lock } from 'lucide-react'

export default function NoAutenticado() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8 sm:px-6 sm:py-12 md:px-8">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <Lock className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 text-red-500" />
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">No estás autenticado</h1>
        <p className="text-gray-600 mb-6">
          Lo sentimos, pero no tienes permiso para acceder a esta página. Por favor, inicia sesión para continuar.
        </p>
        <div className="space-y-3 sm:space-y-4">
          <Button 
            asChild
            className="w-full"
          >
            <Link href="/login">
              Iniciar sesión
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

