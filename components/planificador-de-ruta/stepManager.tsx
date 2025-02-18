"use client";

import { InstrumentoExtendido } from "@/types/instrumentoTypes";
import InstrumentSelector from "./InstrumentSelector/selectInstrumentos";
import { useState } from "react";
import RoutePlanner from "./RoutePlanner/RouttePlanner";
import "maplibre-gl/dist/maplibre-gl.css";
import { AgenteExtendidoDto } from "@/types/agenteTypes";

interface StepPlannerProps{
    instrumentos: InstrumentoExtendido[];
    agente: AgenteExtendidoDto  
}


export default function StepPlanner({instrumentos,agente}: Readonly<StepPlannerProps>) {
    

    const [instrumentosARepartir, setInstrumentosARepartir] = useState<InstrumentoExtendido[]>(instrumentos);
    const [step,setStep] = useState(0);



    function handleSetInstrumentosARepartir(instrumentos: InstrumentoExtendido[]){
        setInstrumentosARepartir(instrumentos);
        setStep(1);
    }

    function handleBack(){
        setInstrumentosARepartir([]);
        setStep(0);
    }
    
    
    
    return (
        <div className="flex w-full h-full ">
            
            {
                step === 0 && <InstrumentSelector instruments={instrumentos} handleSetInstrumentosARepartir={handleSetInstrumentosARepartir} />
            }
            {
                step === 1 && <RoutePlanner instruments={instrumentosARepartir} volver={handleBack} agente={agente}/>
            }
            
        </div>
    )
}