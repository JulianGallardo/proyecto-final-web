import type React from "react"
import { differenceInWeeks } from "date-fns"

interface IndicadorFechaProps {
    fecha: Date
}

const IndicadorFecha: React.FC<IndicadorFechaProps> = ({ fecha }) => {
    const diferenciaEnSemanas = differenceInWeeks(new Date(), fecha)

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
            <div className={`w-5 h-5 rounded-full items-center justify-center ${color}`} title={`${diferenciaEnSemanas} semanas de diferencia`}></div>
        </div>
    )

}

export default IndicadorFecha

