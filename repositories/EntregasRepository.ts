import prisma from "@/lib/db";
import BaseRepository from "./BaseRepository";
import { EntregaInstrumentos } from "@prisma/client";
import { EntregaInstrumentosDto } from "@/types/entregasType";

export default class EntregasRepository extends BaseRepository<EntregaInstrumentos> {
    constructor() {
        super(prisma.entregaInstrumentos);
    }

    itemsPerPage = 9;



    getEntregasPaginated(page: number, agenteId: number, dateQuery: Date): Promise<EntregaInstrumentosDto[]> {
        console.log(dateQuery);
        return this.modelClient.findMany({
            where: {
                AND: [
                    {
                        agenteId: agenteId,
                        createdAt: {
                            gte: new Date(dateQuery.setHours(0, 0, 0, 0)), // Inicio del día
                            lt: new Date(dateQuery.setHours(23, 59, 59, 999)), // Fin del día
                        },
                    }
                ],
            },
            select: {
                id: true,
                instrumento: {
                    select: {
                        caratula: true,
                        domicilio_denunciado: true,
                        instrumentoType: {
                            select: {
                                name: true,
                            }
                        },
                        orden: {
                            select: {
                                ordenNumber: true,
                                juzgado: {
                                    select: {
                                        name: true,
                                    }
                                }
                            }
                        },

                        instrumentoId: true,
                    }
                },
                createdAt: true,
                updatedAt: true,
            },
            skip: (page - 1) * this.itemsPerPage,
            take: this.itemsPerPage,
        });
    }

    async getTotalPages(agenteId: number, dateQuery: Date): Promise<number> {
        const entregaInstrumentosCountPromise = await this.modelClient.count({
            where: {
                AND: [
                    {
                        agenteId: agenteId,
                        createdAt: {
                            gte: new Date(dateQuery.setHours(0, 0, 0, 0)), // Inicio del día
                            lt: new Date(dateQuery.setHours(23, 59, 59, 999)), // Fin del día
                        },

                    }
                ],
            },
        });

        const [instrumentosCount] = await Promise.all([entregaInstrumentosCountPromise]);

        const totalPages = Math.ceil(instrumentosCount / this.itemsPerPage);

        return totalPages;
    }
}