"use server";

import EntregasRepository from "@/repositories/EntregasRepository";
import { AgenteExtendidoDto } from "@/types/agenteTypes";
import { EntregaInstrumentoUpdateDto } from "@/types/entregasType";
import { InstrumentoExtendido } from "@/types/instrumentoTypes";

const entregaInstrumentosRepo = new EntregasRepository();

export async function getEntregasPaginated(page: number, agenteId: number, dateQuery: string) {
    return entregaInstrumentosRepo.getEntregasPaginated(page, agenteId, dateQuery);
}

export async function getTotalPages(agenteId: number, dateQuery: string) {
    return entregaInstrumentosRepo.getTotalPages(agenteId, dateQuery);
}


export async function createEntregas(instruments: InstrumentoExtendido[], agente: AgenteExtendidoDto) {
    return instruments.map(async (instrument) => {
        return await entregaInstrumentosRepo.createEntrega(instrument, agente);
    });
}

export async function createEntrega(instrument: InstrumentoExtendido, agente: AgenteExtendidoDto) {
    return entregaInstrumentosRepo.createEntrega(instrument,agente)
}

export async function updateEntrega(entregaId: number, data:EntregaInstrumentoUpdateDto) {
    return entregaInstrumentosRepo.updateEntrega(entregaId, data);
}
