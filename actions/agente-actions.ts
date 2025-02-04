"use server";

import AgenteRepository from "@/repositories/AgentesRepository";
import UserRepository from "@/repositories/UserRepository";
import { CreateAgenteDTO } from "@/types/agenteTypes";

const userRepo = new UserRepository();
const agenteRepo = new AgenteRepository(userRepo);

export async function createAgente(data: CreateAgenteDTO) {
    return agenteRepo.create(data);
}

export async function getAgentes() {
    return agenteRepo.findAll();
}

