import { Juzgado, InstrumentoType } from "@prisma/client";
import { useState } from "react";

export default function useInfoInstrumentos() {
    const [juzgados, setJuzgados] = useState<Juzgado[]>([]);
    const [instrumentoTypes, setInstrumentoTypes] = useState<InstrumentoType[]>([]);


    return {
        juzgados,
        setJuzgados,
        instrumentoTypes,
        setInstrumentoTypes
    }
}   