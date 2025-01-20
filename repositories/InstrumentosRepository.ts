import prisma from "@/lib/db";
import BaseRepository from "./BaseRepository";
import { Instrumento, Prisma } from "@prisma/client";
import { InstrumentoDTO, InstrumentoExtendido } from "@/types/instrumento";

export default class InstrumentosRepository extends BaseRepository<Instrumento> {
    constructor() {
        super(prisma.instrumento);
    }

    async getInstrumentos(): Promise<InstrumentoExtendido[]> {
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

    async calculateOrdenNumber(juzgadoIdentifier: string):Promise<number>{
        const instrumentos = await this.modelClient.count({
            where: {
                juzgado: {
                    identifier: juzgadoIdentifier,
                },
            }
        });
        return instrumentos + 1;
        
    }

    async createInstrumento(data: InstrumentoDTO): Promise<Instrumento> {
        // Espera a que `ordenNumber` sea calculado antes de usarlo
        const ordenNumber = await this.calculateOrdenNumber(data.juzgadoIdentifier);
    
        // Ahora puedes usar el valor numérico resuelto
        return this.modelClient.create({
            data: {
                entryDate: data.entryDate,
                exitDate: data.exitDate || undefined,
                caratula: data.caratula,
                destinatario: data.destinatario,
                address: data.address,
                ordenNumber: ordenNumber, // Ya no es un Promise
                juzgado: {
                    connect: {
                        identifier: data.juzgadoIdentifier,
                    },
                },
                instrumentoType: {
                    connect: {
                        identifier: data.instrumentoTypeIdentifier,
                    },
                },
            },
        });
    }
    

    async updateInstrumento(
        juzgadoId: number,
        ordenNumber: number,
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

    async deleteInstrumento(juzgadoId: number, ordenNumber: number): Promise<Instrumento | null> {
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
