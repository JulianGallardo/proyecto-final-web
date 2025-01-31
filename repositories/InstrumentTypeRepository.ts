import prisma from "@/lib/db";
import BaseRepository from "./BaseRepository";
import { InstrumentoType } from "@prisma/client";

export default class InstrumentTypeRepository extends BaseRepository<InstrumentoType> {
    constructor() {
        super(prisma.instrumentoType);
    }

    itemsPerPage = 9;

    getByName(name: string): Promise<InstrumentoType | null> {
        return this.modelClient.findFirst({
            where: {
                name:
                    { startsWith: name, mode: "insensitive" }
            }
        });
    }

    getByIdentifier(identifier: string): Promise<InstrumentoType | null> {
        return this.modelClient.findFirst({
            where: {
                identifier:
                    { startsWith: identifier, mode: "insensitive" }
            }
        });
    }

    getTypesPaginated(page: number, query: string): Promise<InstrumentoType[]> {
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