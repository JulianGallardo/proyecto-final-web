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
    // Simulación de repositorio (puedes reemplazar esto con tu lógica real)
    const instrumentos = await instrumentosRepo.getInstrumentos();

    const itemsPerPage = 5;

    // Parsear la query string
    const queryParams = new URLSearchParams(query);
    const searchTerm = queryParams.get("query")?.toLowerCase() || "";
    const entryDate = queryParams.get("entryDate") || "";
    const address = queryParams.get("address")?.toLowerCase() || "";

    // Filtrar los instrumentos según los criterios
   /**
    * const filteredInstrumentos = instrumentos.filter((instrumento) => {
        const matchesQuery =
            !searchTerm || instrumento.name.toLowerCase().includes(searchTerm);
        const matchesEntryDate =
            !entryDate || instrumento.entryDate === entryDate;
        const matchesAddress =
            !address || instrumento.address.toLowerCase().includes(address);

        return matchesQuery && matchesEntryDate && matchesAddress;
    });
    */
    

    // Calcular el total de páginas
    const instrumentosCount = instrumentos.length;
    const totalPages = Math.ceil(instrumentosCount / itemsPerPage);

    // Paginar los instrumentos
    const startIndex = (page - 1) * itemsPerPage;

    const paginatedInstrumentos: InstrumentoExtendido[][] = [];
    for (let i = 0; i < totalPages; i++) {
        const startIndex = i * itemsPerPage;
        const pageData = instrumentos.slice(
            startIndex,
            startIndex + itemsPerPage
        );
        paginatedInstrumentos.push(pageData);
    }

    // Retornar los instrumentos paginados y el total de páginas
    return { paginatedPages: paginatedInstrumentos, totalPages };
}




export async function createInstrumento(data:InstrumentoDTO) {
    return await instrumentosRepo.createInstrumento(data);
}

export async function deleteInstrumento(juzgadoId: number, ordenNumber:number) {
    return  await instrumentosRepo.deleteInstrumento(juzgadoId,ordenNumber);
}

export async function updateInstrumento(juzgadoId: number, ordenNumber:number,  data: InstrumentoDTO) {
    return await instrumentosRepo.updateInstrumento(juzgadoId,ordenNumber, data);
}


