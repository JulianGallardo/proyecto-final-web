"use server";

import EntregasRepository from "@/repositories/EntregasRepository";
import { AgenteExtendidoDto } from "@/types/agenteTypes";
import { InstrumentoExtendido } from "@/types/instrumentoTypes";
import { EstadoEntrega } from "@prisma/client";

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

export async function updateEntrega(entregaId: number, instrument: InstrumentoExtendido, estado: EstadoEntrega, observaciones?: string) {
    return entregaInstrumentosRepo.updateEntrega(entregaId, instrument, estado, observaciones);
}
