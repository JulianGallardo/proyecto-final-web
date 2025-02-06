"use server";

import EntregasRepository from "@/repositories/EntregasRepository";

const entregaInstrumentosRepo = new EntregasRepository();

export async function getEntregasPaginated(page: number, agenteId: number, dateQuery: Date) {
    return entregaInstrumentosRepo.getEntregasPaginated(page, agenteId, dateQuery);
}

export async function getTotalPages(agenteId: number, dateQuery: Date) {
    return entregaInstrumentosRepo.getTotalPages(agenteId, dateQuery);
}