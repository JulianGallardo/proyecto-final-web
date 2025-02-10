"use server";

import EntregasRepository from "@/repositories/EntregasRepository";

const entregaInstrumentosRepo = new EntregasRepository();

export async function getEntregasPaginated(page: number, agenteId: number, dateQuery: string) {
    return entregaInstrumentosRepo.getEntregasPaginated(page, agenteId, dateQuery);
}

export async function getTotalPages(agenteId: number, dateQuery: string) {
    return entregaInstrumentosRepo.getTotalPages(agenteId, dateQuery);
}