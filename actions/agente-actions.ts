"use server";

import AgenteRepository from "@/repositories/AgentesRepository";
import UserRepository from "@/repositories/UserRepository";
import { CreateAgenteDTO } from "@/types/agenteTypes";
import { revalidatePath } from "next/cache";

const userRepo = new UserRepository();
const agenteRepo = new AgenteRepository(userRepo);

export async function createAgente(data: CreateAgenteDTO) {
    const agente = agenteRepo.create(data);
    revalidatePath('/agentes');
    return agente;
}

export async function getAgentes() {
    return agenteRepo.findAll();
}

export async function getAgentesPaginated(page: number, query: string) {
    return agenteRepo.findAllPaginated(page, query);
}

export async function getTotalPages(query: string) {
    return agenteRepo.getTotalPages(query);
}


