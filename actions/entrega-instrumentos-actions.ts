"use server";

import EntregasRepository from "@/repositories/EntregasRepository";
import { AgenteExtendidoDto } from "@/types/agenteTypes";
import { EntregaInstrumentoUpdateDto } from "@/types/entregasType";
import { InstrumentoExtendido } from "@/types/instrumentoTypes";
import { revalidatePath } from "next/cache";

const entregaInstrumentosRepo = new EntregasRepository();

export async function getEntregasPaginated(page: number, agenteId: number, dateQuery: string) {
    return entregaInstrumentosRepo.getEntregasPaginated(page, agenteId, dateQuery);
}

export async function getTotalPages(agenteId: number, dateQuery: string) {
    return entregaInstrumentosRepo.getTotalPages(agenteId, dateQuery);
}


export async function createEntregas(instruments: InstrumentoExtendido[], agente: AgenteExtendidoDto) {
    const entregas= instruments.map(async (instrument) => {
        return await entregaInstrumentosRepo.createEntrega(instrument, agente);
    });
    revalidatePath("/entregas");
    return entregas;
}

export async function createEntrega(instrument: InstrumentoExtendido, agente: AgenteExtendidoDto) {
    const entrega = entregaInstrumentosRepo.createEntrega(instrument, agente)
    
    return entrega;
}

export async function updateEntrega(entregaId: number, data: EntregaInstrumentoUpdateDto) {
    const entrega = entregaInstrumentosRepo.updateEntrega(entregaId, data);
    revalidatePath("/entregas");
    return entrega;
}
