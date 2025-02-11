"use client";

import { InstrumentoExtendido } from "@/types/instrumentoTypes";
import InstrumentSelector from "./selectInstrumentos";
import { useState } from "react";
import RoutePlanner from "./planificador";

interface StepPlannerProps{
    instrumentos: InstrumentoExtendido[];
}


export default function StepPlanner({instrumentos}: Readonly<StepPlannerProps>) {
    

    const [instrumentosARepartir, setInstrumentosARepartir] = useState<InstrumentoExtendido[]>(instrumentos);
    const [step,setStep] = useState(0);



    function handleSetInstrumentosARepartir(instrumentos: InstrumentoExtendido[]){
        setInstrumentosARepartir(instrumentos);
        setStep(1);
    }
    
    
    
    return (
        <div className="flex flex-col w-full h-full p-4">
            
            {
                step === 0 && <InstrumentSelector instruments={instrumentos} handleSetInstrumentosARepartir={handleSetInstrumentosARepartir} />
            }
            {
                step === 1 && <RoutePlanner instruments={instrumentosARepartir} />
            }
            
        </div>
    )
}