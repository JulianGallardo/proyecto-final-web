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
import InstrumentosTypeService from "@/lib/instrumentosTypeService";

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
const typeService = new InstrumentosTypeService(instrumentTypesRepo);

export async function getJuzgados() {
    return juzgadoService.getJuzgados();
}


export async function getInstrumentTypes() {
    return typeService.getTypes();
}

export async function createJuzgado(data: Prisma.JuzgadoCreateInput) {
    const juzgado = await juzgadoService.createJuzgado(data);
    revalidatePath("/juzgados");
    return juzgado;
}

export async function createInstrumentType(data: Prisma.InstrumentoTypeCreateInput) {
    const type = await typeService.createType(data);
    revalidatePath("/instrumentos-tipo");
    return type;
}

export async function updateJuzgado(id: number, data: Prisma.JuzgadoUpdateInput) {
    const juzgado = await juzgadoService.updateJuzgado(id,data);
    revalidatePath("/juzgados");
    return juzgado;
}

export async function updateInstrumentType(id: number, data: Prisma.InstrumentoTypeUpdateInput) {
    const type = await typeService.updateType(id, data);
    revalidatePath("/instrumentos-tipo");
    return type;
}

export async function deleteJuzgado(id: number) {
    const juzgado = await juzgadoService.deleteJuzgado(id);
    revalidatePath("/juzgados");
    return juzgado;
}

export async function deleteInstrumentType(id: number) {
    const type = await typeService.deleteType(id);
    revalidatePath("/instrumentos-tipo");
    return type;
}

export async function getTypesPaginated(page: number, query: string) {
    return typeService.getTypesPaginated(page, query);
}

export async function getTypeTotalPages(query: string) {
    return typeService.getTotalPages(query);
}


export async function getJuzgadosPaginated(page: number, query: string) {
    return juzgadoService.getJuzgadosPaginated(page, query);
}

export async function getJuzgadosTotalPages(query: string) {
    return juzgadoService.getTotalPages(query);
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
