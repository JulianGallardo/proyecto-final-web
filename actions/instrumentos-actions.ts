"use server";
import InstrumentosRepository from "@/repositories/InstrumentosRepository";
import JuzgadoRepository from "@/repositories/JuzgadoRepository";
import InstrumentTypeRepository from "@/repositories/InstrumentTypeRepository";
import { InstrumentoDTO } from "@/types/instrumento";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";


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
    const instrumento =  await instrumentosRepo.createInstrumento(data);
    revalidatePath("/instrumentos");
    return instrumento;
    
}

export async function deleteInstrumento(juzgadoId: number, ordenNumber: number) {
   const deleted = await instrumentosRepo.deleteInstrumento(juzgadoId, ordenNumber);
    revalidatePath("/instrumentos");
    return deleted;
}

export async function updateInstrumento(juzgadoId: number, ordenNumber: number, data: InstrumentoDTO) {
    const updated = await instrumentosRepo.updateInstrumento(juzgadoId, ordenNumber, data);
    revalidatePath("/instrumentos");
    return updated;
}


