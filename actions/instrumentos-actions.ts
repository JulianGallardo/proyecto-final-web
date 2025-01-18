"use server";
import InstrumentosRepository from "@/repositories/InstrumentosRepository";
import JuzgadoRepository from "@/repositories/JuzgadoRepository";
import InstrumentTypeRepository from "@/repositories/InstrumentTypeRepository";
import { InstrumentoDTO } from "@/types/instrumento";
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

export async function createInstrumento(data:InstrumentoDTO) {
    return instrumentosRepo.createInstrumento(data);
}

export async function deleteInstrumento(juzgadoId: string, ordenNumber:string) {
    return instrumentosRepo.deleteInstrumento(juzgadoId,ordenNumber);
}

export async function updateInstrumento(juzgadoId: string, ordenNumber:string,  data: InstrumentoDTO) {
    return instrumentosRepo.updateInstrumento(juzgadoId,ordenNumber, data);
}


