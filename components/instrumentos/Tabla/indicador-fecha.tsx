import type React from "react"
import { differenceInWeeks, differenceInDays } from "date-fns"
import { UrgenciaInstrumento } from "@prisma/client"

interface IndicadorFechaProps {
    fecha: Date
    urgencia: UrgenciaInstrumento
}

const IndicadorFecha: React.FC<IndicadorFechaProps> = ({ fecha, urgencia }) => {
    const diferenciaEnSemanas = differenceInWeeks(new Date(), fecha)
    const diferenciaEnDias = differenceInDays(new Date(), fecha)
    if (urgencia === UrgenciaInstrumento.URGENTE) {
        return (
            <div className="flex items-center justify-center">
                <div 
                    className="w-8 h-8 rounded-full border-2 border-red-500 flex items-center justify-center"
                    title={`${diferenciaEnDias} días de retraso`}
                >
                    <span className="text-red-500 text-sm font-semibold">
                        {diferenciaEnDias}
                    </span>
                </div>
            </div>
        )
    }

    let color = ""
    if (diferenciaEnSemanas <= 1) {
        color = "bg-green-500"
    } else if (diferenciaEnSemanas <= 3) {
        color = "bg-yellow-500"
    } else {
        color = "bg-red-500"
    }

    return (
        <div className="flex items-center justify-center">
            <div 
                className={`w-8 h-8 rounded-full items-center justify-center ${color}`} 
                title={`${diferenciaEnSemanas} semanas de diferencia`}
            />
        </div>
    )
}

export default IndicadorFecha