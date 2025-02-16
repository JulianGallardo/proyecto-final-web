import prisma from "@/lib/db";
import BaseRepository from "./BaseRepository";
import { EntregaInstrumentos } from "@prisma/client";
import { EntregaInstrumentosDto, EntregaInstrumentoUpdateDto } from "@/types/entregasType";
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

    async updateEntrega(entregaId: number, data: EntregaInstrumentoUpdateDto): Promise<EntregaInstrumentos> {
        const result  = await prisma.$transaction(async (tsx) => {
            const update = await tsx.entregaInstrumentos.update({
                where: {
                    id: entregaId,
                },
                data: {
                    instrumentoId: data.instrumento.codigoInstrumento,
                    estado: data.estado,
                    updatedAt: new Date(),
                    observaciones: data.observaciones
                },
            });

            const instrumento = await tsx.instrumento.update({
                where: {
                    codigoInstrumento: data.instrumento.codigoInstrumento,
                },
                data: {
                    fecha_de_salida: data.estado === "ENTREGADO" ? new Date() : null,
                },
            });
    
            return {update, instrumento};
        });

        return result.update;
    }

    getEntregasPaginated(page: number, agenteId: number, dateQuery: string): Promise<EntregaInstrumentosDto[]> {
        const [year, month, day] = dateQuery.split("-").map(Number);
        const gte = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
        const lt = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

        return this.modelClient.findMany({
            where: {
                AND: [
                    {
                        agenteId: agenteId,
                        fecha_entrega: {
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
                        codigoInstrumento: true,
                        cargaInstrumento: true,
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

                    }
                },
                estado:true,
                observaciones: true,
                fecha_entrega: true,
                updatedAt: true,
            },
            skip: (page - 1) * this.itemsPerPage,
            take: this.itemsPerPage,
        });
    }

    async getTotalPages(agenteId: number, dateQuery: string): Promise<number> {
        const [year, month, day] = dateQuery.split("-").map(Number);
        const gte = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
        const lt = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

        const entregaInstrumentosCountPromise = await this.modelClient.count({
            where: {
                AND: [
                    {
                        agenteId: agenteId,
                        fecha_entrega: {
                            gte: gte,
                            lt: lt
                        },

                    }
                ],
            },
        });

        const [instrumentosCount] = await Promise.all([entregaInstrumentosCountPromise]);
        return Math.ceil(instrumentosCount / this.itemsPerPage);
    }

    async getHistoricalActivity(): Promise<any> {
        return this.modelClient.findMany({
            select: {
                fecha_entrega: true,
                estado: true,
                agente: {
                    select: {
                        nombre: true
                    }
                }
            },
            orderBy: {
                fecha_entrega: "asc"
            }
        });
    }

    async getRecentActivity(): Promise<any> {
        return this.modelClient.findMany({
            select: {
                id: true,
                estado: true,
                fecha_entrega: true,
                agente: {
                    select: {
                        nombre: true
                    }
                },
                instrumento: {
                    select: {
                        caratula: true,
                        codigoInstrumento: true
                    }
                }
            },
            orderBy: {
                fecha_entrega: "desc"
            },
            take: 20
        });
    }
    
}
