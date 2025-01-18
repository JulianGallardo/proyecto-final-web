import prisma from "@/lib/db";
import BaseRepository from "./BaseRepository";
import { Instrumento } from "@prisma/client";
import { InstrumentoDTO } from "@/types/instrumento";

export default class InstrumentosRepository extends BaseRepository<Instrumento> {
    constructor() {
        super(prisma.instrumento);
    }

    async getInstrumentos(): Promise<Instrumento[]> {
        return this.modelClient.findMany({
            select: {
                entryDate: true,
                exitDate: true,
                caratula: true,
                destinatario: true,
                address: true,
                ordenNumber: true,
                juzgadoId: true,
                instrumentoTypeId: true,
                juzgado: {
                    select: {
                        name: true,
                        identifier: true,
                    },
                },
                instrumentoType: {
                    select: {
                        name: true,
                        identifier: true,
                    },
                },
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async createInstrumento(data: InstrumentoDTO): Promise<Instrumento> {
        return this.modelClient.create({
            data: {
                entryDate: data.entryDate,
                exitDate: data.exitDate,
                caratula: data.caratula,
                destinatario: data.destinatario,
                address: data.address,
                ordenNumber: data.ordenNumber,
                juzgadoId: data.juzgadoId,
                instrumentoTypeId: data.instrumentoTypeId,
                juzgado: {
                    connect: {
                        identifier: data.juzgadoId,
                    },
                },
                instrumentoType: {
                    connect: {
                        identifier: data.instrumentoTypeId,
                    },
                },
            },

        });
    }

    async updateInstrumento(
        juzgadoId: string,
        ordenNumber: string,
        data: Partial<InstrumentoDTO>
    ): Promise<Instrumento | null> {
        return this.modelClient.update({
            where: {
                juzgadoId_ordenNumber: {
                    juzgadoId,
                    ordenNumber,
                },
            },
            data: {
                ...data,
            },
        });
    }

    async deleteInstrumento(juzgadoId: string, ordenNumber: string): Promise<Instrumento | null> {
        return this.modelClient.delete({
            where: {
                juzgadoId_ordenNumber: {
                    juzgadoId,
                    ordenNumber,
                },
            },
        });
    }
}
