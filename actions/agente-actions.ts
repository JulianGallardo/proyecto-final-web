"use server";

import AgenteRepository from "@/repositories/AgentesRepository";
import UserRepository from "@/repositories/UserRepository";
import { CreateAgenteDTO, UpdateAgenteDto } from "@/types/agenteTypes";
import { revalidatePath } from "next/cache";

const userRepo = new UserRepository();
const agenteRepo = new AgenteRepository(userRepo);

export async function createAgente(data: CreateAgenteDTO) {
    const agente = agenteRepo.create(data);
    revalidatePath('/agentes');
    return agente;
}

export async function updateAgente(id: number, data: UpdateAgenteDto) {
    const agente = agenteRepo.update(id, data);
    revalidatePath('/agentes');
    revalidatePath(`/agentes/ver/${id}`);
    return agente;
}

export async function deleteAgente(id: number) {
    const agente = agenteRepo.delete(id);
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

export async function getAgenteById(id: number) {
    return agenteRepo.findById(id);
}

export async function getAgenteByMail(mail: string) {
    return agenteRepo.findByMail(mail);
}



