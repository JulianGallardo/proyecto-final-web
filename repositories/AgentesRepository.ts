import prisma from "@/lib/db";
import BaseRepository from "./BaseRepository";
import { Agente } from "@prisma/client";
import UserRepository from "./UserRepository";
import { AgenteExtendidoDto, CreateAgenteDTO, UpdateAgenteDto } from "@/types/agenteTypes";
import { hashPassword } from "@/lib/utils";

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
                password: await hashPassword(data.password),
                role: "agente",
                name: data.name,
                lastname: data.lastName,
                telefono: data.telefono,
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

    async update(id: number, data: Partial<UpdateAgenteDto>) {
        return this.modelClient.update({
            where: { id },
            data: {
                user: {
                    update: {
                        email: data.email,
                        name: data.name,
                        lastname: data.lastName,
                        telefono: data.telefono,
                    },
                },
            },
        });
    }

    async delete(id: number) {
        return this.modelClient.delete({
            where: { id },
        });
    }


    async findAllPaginated(page: number, query: string) {
        const take = 10;
        const skip = (page - 1) * take;
        return this.modelClient.findMany({
            take,
            skip,
            where: {
                user: {
                    name: {
                        contains: query,
                    },
                },
            },
            include: { user: true, zonas: true, EntregaInstrumentos: true },
        });
    }

    async getTotalPages(query: string) {
        const total = await this.modelClient.count({
            where: {
                user: {
                    name: {
                        contains: query,
                    },
                },
            },
        });
        return Math.ceil(total / 10);
    }


    async findByMail(mail: string) {
        const result = this.modelClient.findFirst({
            where: {
                user: {
                    email: mail,
                },
            },
            include: { user: true, zonas: true, EntregaInstrumentos: true },
        });
        return result;
    }

    async getAgentGrowth(): Promise<{ total: number; growth: number }> {
        const totalAgents = await prisma.agente.count();

        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const lastMonthAgents = await prisma.agente.count({
            where: {
                createdAt: {
                    lt: lastMonth,
                },
            },
        });

        const growth = totalAgents - lastMonthAgents;

        return { total: totalAgents, growth };
    }


}

