import prisma from "@/lib/db";
import BaseRepository from "./BaseRepository";
import { Juzgado } from "@prisma/client";

export default class AgenteRepository extends BaseRepository<Juzgado> {
    constructor() {
        super(prisma.user);
    }

    itemsPerPage = 9;

    getByName(name: string): Promise<Juzgado | null> {
        return this.modelClient.findFirst({ where: { name } });
    }

    getByIdentifier(identifier: string): Promise<Juzgado | null> {
        return this.modelClient.findFirst({ where: { identifier } });
    }

    getJuzgadosPaginated(page: number, query: string): Promise<Juzgado[]> {
        return this.modelClient.findMany({
            where: {
                OR: [
                    { name: { startsWith: query, mode: "insensitive" } },
                ],
            },
            skip: (page - 1) * this.itemsPerPage,
            take: this.itemsPerPage,
        });
    }

    async getTotalPages(query: string): Promise<number> { 
        const juzgadosCountPromise = await this.modelClient.count({
            where: {
                OR: [
                    { name: { startsWith: query, mode: "insensitive" } },
                ],
            },
        });

        const [instrumentosCount] = await Promise.all([juzgadosCountPromise]);

        const totalPages = Math.ceil(instrumentosCount / this.itemsPerPage);

        return totalPages;
    }
}