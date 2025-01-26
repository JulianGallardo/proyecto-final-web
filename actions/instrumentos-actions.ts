"use server";
import InstrumentosRepository from "@/repositories/InstrumentosRepository";
import JuzgadoRepository from "@/repositories/JuzgadoRepository";
import InstrumentTypeRepository from "@/repositories/InstrumentTypeRepository";
import { InstrumentoDTO, InstrumentPDFDTO } from "@/types/instrumento";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import SearchParamsInstrumentos from "@/types/searchParams";
import InstrumentoService from "@/lib/instrumentoService";


const instrumentosRepo = new InstrumentosRepository();
const juzgadosRepo = new JuzgadoRepository();
const instrumentTypesRepo = new InstrumentTypeRepository();
const instrumentoService = new InstrumentoService(
    juzgadosRepo,
    instrumentTypesRepo,
    instrumentosRepo
);


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
    return instrumentoService.getInstrumentos();
}

export async function getInstrumentosPaginated(searchParams:SearchParamsInstrumentos, page: number) {
    const instrumentos = await instrumentoService.getInstrumentosPaginated(searchParams, page);
    return instrumentos;
}

export async function getTotalPagesInstrumentosPaginated(searchParams: SearchParamsInstrumentos) {
    const totalPages = await instrumentoService.getTotalPagesInstrumentosPaginated(searchParams);
    return totalPages;
}

export async function createInstrumento(data: InstrumentoDTO) {
    const instrumento =  await instrumentoService.createInstrumento(data);
    revalidatePath("/instrumentos");
    return instrumento;
    
}

export async function deleteInstrumento(juzgadoId: number, ordenNumber: number) {
   const deleted = await instrumentoService.deleteInstrumento(juzgadoId, ordenNumber);
    revalidatePath("/instrumentos");
    return deleted;
}

export async function updateInstrumento(juzgadoId: number, ordenNumber: number, data: InstrumentoDTO) {
    const updated = await instrumentoService.updateInstrumento(juzgadoId, ordenNumber, data);
    revalidatePath("/instrumentos");
    return updated;
}

export async function createInstrumentoFromPDF(instrumento: InstrumentPDFDTO) {
    const created = await instrumentoService.createInstrumentoFromPDF(instrumento);
    revalidatePath("/instrumentos");
    return created;
}


