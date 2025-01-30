"use server";
import InstrumentosRepository from "@/repositories/InstrumentosRepository";
import JuzgadoRepository from "@/repositories/JuzgadoRepository";
import InstrumentTypeRepository from "@/repositories/InstrumentTypeRepository";
import { InstrumentoDTO, InstrumentPDFDTO } from "@/types/instrumentoTypes";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import SearchParamsInstrumentos from "@/types/searchParams";
import InstrumentoService from "@/lib/instrumentoService";
import OrdenRepository from "@/repositories/OrdenRepository";
import JuzgadoService from "@/lib/juzgadoService";

const ordenRepository = new OrdenRepository();
const instrumentosRepo = new InstrumentosRepository(ordenRepository);
const juzgadosRepo = new JuzgadoRepository();
const instrumentTypesRepo = new InstrumentTypeRepository();

const instrumentoService = new InstrumentoService(
    juzgadosRepo,
    instrumentTypesRepo,
    instrumentosRepo
);
const juzgadoService = new JuzgadoService(juzgadosRepo);


export async function getJuzgados() {
    return juzgadoService.getJuzgados();
}

export async function getInstrumentTypes() {
    return instrumentTypesRepo.getAll();
}

export async function createJuzgado(data: Prisma.JuzgadoCreateInput) {
    return juzgadoService.createJuzgado(data);
}

export async function createInstrumentType(data: Prisma.InstrumentoTypeCreateInput) {
    return instrumentTypesRepo.create(data);
}

export async function updateJuzgado(id: number, data: Prisma.JuzgadoUpdateInput) {
    return juzgadoService.updateJuzgado(id, data);
}

export async function updateInstrumentType(id: number, data: Prisma.InstrumentoTypeUpdateInput) {
    return instrumentTypesRepo.update(id, data);
}

export async function deleteJuzgado(id: number) {
    return juzgadoService.deleteJuzgado(id);
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

export async function deleteInstrumento(juzgadoIdentifier: string, ordenNumber: number) {
   const deleted = await instrumentoService.deleteInstrumento(juzgadoIdentifier, ordenNumber);
    revalidatePath("/instrumentos");
    return deleted;
}

export async function updateInstrumento(juzgadoIdentifier: string, ordenNumber: number, data: InstrumentoDTO) {
    const updated = await instrumentoService.updateInstrumento(juzgadoIdentifier, ordenNumber, data);
    revalidatePath("/instrumentos");
    return updated;
}

export async function createInstrumentos(instrumentos: InstrumentoDTO[]) {
    const created = await instrumentoService.createInstrumentos(instrumentos);
    revalidatePath("/instrumentos");
    return created;
}

export async function deleteDuplicatePdfEntries(instrumentos: InstrumentPDFDTO[]) {
    const { filteredInstrument, instrumentosWithErrors } = await instrumentoService.deleteDuplicatePdfEntries(instrumentos);
    return { filteredInstrument, instrumentosWithErrors };
}
