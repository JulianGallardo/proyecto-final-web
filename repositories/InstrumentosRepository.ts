import prisma from "@/lib/db";
import BaseRepository from "./BaseRepository";
import { Instrumento } from "@prisma/client";

export default class InstrumentosRepository extends BaseRepository<Instrumento> {
    constructor() {
        super(prisma.instrumento);
    }

    async getInstrumentos(): Promise<Instrumento[]> {
        return this.modelClient.findMany(
            {
                select:{
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
                        }
                    },

                    instrumentoType: {
                        select: {
                            name: true,
                            identifier: true,
                        }
                    },

                    createdAt: true,
                    updatedAt: true

                }
            }
        );
    }

}