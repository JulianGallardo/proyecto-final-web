import prisma from "@/lib/db";
import BaseRepository from "./BaseRepository";
import { EntregaInstrumentos, EstadoEntrega } from "@prisma/client";
import { EntregaInstrumentosDto } from "@/types/entregasType";
import { InstrumentoExtendido } from "@/types/instrumentoTypes";
import { AgenteExtendidoDto } from "@/types/agenteTypes";

export default class EntregasRepository extends BaseRepository<EntregaInstrumentos> {
    constructor() {
        super(prisma.entregaInstrumentos);
    }

    itemsPerPage = 9;


    createEntrega(instrument: InstrumentoExtendido, agente: AgenteExtendidoDto): Promise<EntregaInstrumentos> {
        return this.modelClient.create({
            data: {
                instrumentoId: instrument.codigoInstrumento,
                agenteId: agente.id,
            },
        });

    }

    updateEntrega(entregaId: number, instrument: InstrumentoExtendido, estado: EstadoEntrega, observaciones?: string): Promise<EntregaInstrumentos> {
        return this.modelClient.update({
            where: {
                id: entregaId,
            },
            data: {
                instrumentoId: instrument.codigoInstrumento,
                instrumento: {
                    connect: {
                        instrumentoId: instrument.codigoInstrumento,
                    }
                },
                estado: estado,
                updatedAt: new Date(),
                observaciones: observaciones
            },

        });
    }



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