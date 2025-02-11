"use client";

import { InstrumentoExtendido } from "@/types/instrumentoTypes";
import InstrumentSelector from "./selectInstrumentos";

interface StepPlannerProps{
    instrumentos: InstrumentoExtendido[];
}


export default function StepPlanner({instrumentos}: Readonly<StepPlannerProps>) {
    
    
    
    
    
    return (
        <div>
            <InstrumentSelector instruments={instrumentos}/>
        </div>
    )
}