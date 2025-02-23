import prisma from "@/lib/db";
import BaseRepository from "./BaseRepository";
import { EntregaInstrumentos, EstadoEntrega, EstadoInstrumento, Prisma, PrismaClient } from "@prisma/client";
import { EntregaInstrumentosDto, EntregaInstrumentoUpdateDto } from "@/types/entregasType";
import { InstrumentoExtendido } from "@/types/instrumentoTypes";
import { AgenteExtendidoDto } from "@/types/agenteTypes";
import { DefaultArgs } from "@prisma/client/runtime/library";

export default class EntregasRepository extends BaseRepository<EntregaInstrumentos> {
    constructor() {
        super(prisma.entregaInstrumentos);
    }

    itemsPerPage = 9;

    async createEntrega(instrument: InstrumentoExtendido, agente: AgenteExtendidoDto): Promise<EntregaInstrumentos> {

        const result = await prisma.$transaction(async (tsx) => {
            const entrega = await tsx.entregaInstrumentos.create({
                data: {
                    instrumentoId: instrument.codigoInstrumento,
                    agenteId: agente.id,
                    agenteFullName: `${agente.user.name} ${agente.user.lastname}`,
                },
            });

            const instrumento = await tsx.instrumento.update({
                where: {
                    codigoInstrumento: instrument.codigoInstrumento,
                },
                data: {
                    estado: EstadoInstrumento.PENDIENTE_DE_NOTIFICAR,
                },
            });

            return { entrega, instrumento };
        });

        return result.entrega;
    }

    async updateEntrega(entregaId: number, data: EntregaInstrumentoUpdateDto): Promise<EntregaInstrumentos> {
        const result = await prisma.$transaction(async (tsx) => {
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


            let estadoInstrumento = await calcularEstadoInstrumento(data, tsx);


            const instrumento = await tsx.instrumento.update({
                where: {
                    codigoInstrumento: data.instrumento.codigoInstrumento,
                },
                data: {
                    estado: estadoInstrumento,
                    fecha_de_salida: data.estado === "NOTIFICADO" ? new Date() : null,
                },
            });

            return { update, instrumento };
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
                estado: true,
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
async function calcularEstadoInstrumento(data: EntregaInstrumentoUpdateDto, tsx: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">) {
    let estadoInstrumento;
    if (data.estado === EstadoEntrega.NOTIFICADO) {
        const instrumento = await tsx.instrumento.findUnique({
            where: {
                codigoInstrumento: data.instrumento.codigoInstrumento
            }
        });

        const fecha_entrada = instrumento?.fecha_de_ingreso;

        if (fecha_entrada) {
            const diferenciaDeDias = Math.floor((new Date().getTime() - fecha_entrada.getTime()) / (1000 * 60 * 60 * 24));
            if (diferenciaDeDias <= 7) {
                estadoInstrumento = EstadoInstrumento.NOTIFICADO_VERDE;
            } else if (diferenciaDeDias <= 14) {
                estadoInstrumento = EstadoInstrumento.NOTIFICADO_AMARILLO;
            } else {
                estadoInstrumento = EstadoInstrumento.NOTIFICADO_ROJO;
            }
        }
    } else if (data.estado === EstadoEntrega.PENDIENTE_DE_PROCESAR) {
        estadoInstrumento = EstadoInstrumento.PENDIENTE_DE_PROCESAR_NOTIFICACION;
    } else if (data.estado === EstadoEntrega.NO_NOTIFICADO) {
        estadoInstrumento = EstadoInstrumento.PENDIENTE_DE_NOTIFICAR;
    }
    return estadoInstrumento;
}

