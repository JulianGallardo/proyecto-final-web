"use server";
import InstrumentosRepository from "@/repositories/InstrumentosRepository";
import JuzgadoRepository from "@/repositories/JuzgadoRepository";
import InstrumentTypeRepository from "@/repositories/InstrumentTypeRepository";
import { InstrumentoDTO, InstrumentoExtendido } from "@/types/instrumento";
import { Prisma } from "@prisma/client";


const instrumentosRepo = new InstrumentosRepository();
const juzgadosRepo = new JuzgadoRepository();
const instrumentTypesRepo = new InstrumentTypeRepository();


export async function getJuzgados() {
    return juzgadosRepo.getAll();
}

export async function getInstrumentTypes() {
    return instrumentTypesRepo.getAll();
}

export async function createJuzgado(data: Prisma.JuzgadoCreateInput) {
    return juzgadosRepo.create(data);
}

export async function createInstrumentType(data: Prisma.InstrumentoTypeCreateInput) {
    return instrumentTypesRepo.create(data);
}

export async function updateJuzgado(id: number, data: Prisma.JuzgadoUpdateInput) {
    return juzgadosRepo.update(id, data);
}

export async function updateInstrumentType(id: number, data: Prisma.InstrumentoTypeUpdateInput) {
    return instrumentTypesRepo.update(id, data);
}

export async function deleteJuzgado(id: number) {
    return juzgadosRepo.delete(id);
}

export async function deleteInstrumentType(id: number) {
    return instrumentTypesRepo.delete(id);
}

//----------------------------------------------- Instrumentos----------------------------------------------------------------

export async function getInstrumentos() {
    return instrumentosRepo.getInstrumentos();
}

export async function getInstrumentosPaginated(query: string, page: number) {
    const instrumentos = await instrumentosRepo.getInstrumentosPaginated(query, page);
    return instrumentos;
}

export async function getTotalPagesInstrumentosPaginated(query: string) {
    const totalPages = await instrumentosRepo.getTotalPagesInstrumentosPaginated(query);
    return totalPages;
}

export async function createInstrumento(data: InstrumentoDTO) {
    return await instrumentosRepo.createInstrumento(data);
}

export async function deleteInstrumento(juzgadoId: number, ordenNumber: number) {
    return await instrumentosRepo.deleteInstrumento(juzgadoId, ordenNumber);
}

export async function updateInstrumento(juzgadoId: number, ordenNumber: number, data: InstrumentoDTO) {
    return await instrumentosRepo.updateInstrumento(juzgadoId, ordenNumber, data);
}


