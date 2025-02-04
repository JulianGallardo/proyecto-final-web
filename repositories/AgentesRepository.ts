import prisma from "@/lib/db";
import BaseRepository from "./BaseRepository";
import { Agente } from "@prisma/client";
import UserRepository from "./UserRepository";
import { AgenteExtendidoDto, CreateAgenteDTO } from "@/types/agenteTypes";

export default class AgenteRepository extends BaseRepository<Agente> {
    constructor(userRepo: UserRepository) {
        super(prisma.agente);
        this.userRepo = userRepo;
    }
    userRepo: UserRepository;

    async create(data: CreateAgenteDTO) {
        return prisma.$transaction(async (tx) => {
            const user = await this.userRepo.create({
                email: data.email,
                password: data.password,
                role: "agente",
                name: data.name,
            });
            
            const agente = await tx.agente.create({
                data: {
                    userId: user.id,
                },
            });
            
            return agente;
        });
    }

    async findById(id: number) {
        return this.modelClient.findUnique({
            where: { id },
            include: { user: true, zonas: true, EntregaInstrumentos: true },
        });
    }

    async findAll(): Promise<AgenteExtendidoDto[]> {
        return this.modelClient.findMany({
            include: { user: true, zonas: true, EntregaInstrumentos: true },
        });
    }

    async update(id: number, data: Partial<CreateAgenteDTO>) {
        return this.modelClient.update({
            where: { id },
            data,
        });
    }

    async delete(id: number) {
        return this.modelClient.delete({
            where: { id },
        });
    }
}
