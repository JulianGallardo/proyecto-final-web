import prisma from "@/lib/db";
import BaseRepository from "./BaseRepository";
import { EntregaInstrumentos } from "@prisma/client";
import { EntregaInstrumentosDto } from "@/types/entregasType";
import { parseDate } from "@/lib/utils";

export default class EntregasRepository extends BaseRepository<EntregaInstrumentos> {
    constructor() {
        super(prisma.entregaInstrumentos);
    }

    itemsPerPage = 9;



    getEntregasPaginated(page: number, agenteId: number, dateQuery: string): Promise<EntregaInstrumentosDto[]> {
        // Convertir el string a una fecha en UTC
        const [year, month, day] = dateQuery.split("-").map(Number);

        // Crear el inicio y fin del día en UTC
        const gte = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)); // Inicio del día
        const lt = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999)); // Fin del día

        return this.modelClient.findMany({
            where: {
                AND: [
                    {
                        agenteId: agenteId,
                        createdAt: {
                            gte: gte,
                            lt: lt
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

    async getTotalPages(agenteId: number, dateQuery: string): Promise<number> {

        // Convertir el string a una fecha en UTC
        const [year, month, day] = dateQuery.split("-").map(Number);

        // Crear el inicio y fin del día en UTC
        const gte = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)); // Inicio del día
        const lt = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999)); // Fin del día


        const entregaInstrumentosCountPromise = await this.modelClient.count({
            where: {
                AND: [
                    {
                        agenteId: agenteId,
                        createdAt: {
                            gte: gte, // Inicio del día
                            lt: lt
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