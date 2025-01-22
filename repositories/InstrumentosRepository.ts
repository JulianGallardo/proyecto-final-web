import prisma from "@/lib/db";
import BaseRepository from "./BaseRepository";
import { Instrumento } from "@prisma/client";
import { InstrumentoDTO, InstrumentoExtendido } from "@/types/instrumento";
import SearchParamsInstrumentos from "@/types/searchParams";
import db from "@/lib/db";
import { exit } from "process";

export default class InstrumentosRepository extends BaseRepository<Instrumento> {
    constructor() {
        super(prisma.instrumento);
    }

    itemsPerPage = 10;


    filters(searchParams: SearchParamsInstrumentos) {
        // Construir dinámicamente el objeto "where"
        const where: any = {
            OR: [],
        };

        if (searchParams.entryDate) {
            where.OR.push({ entryDate: { gte: new Date(searchParams.entryDate) } });
        }

        if (searchParams.exitDate) {
            where.OR.push({ exitDate: { lte: new Date(searchParams.exitDate) } });
        }

        if (searchParams.caratula) {
            where.OR.push({ caratula: { startsWith: searchParams.caratula, mode: "insensitive" } });
        }

        if (searchParams.destinatario) {
            where.OR.push({ destinatario: { startsWith: searchParams.destinatario, mode: "insensitive" } });
        }

        if (searchParams.address) {
            where.OR.push({ address: { startsWith: searchParams.address, mode: "insensitive" } });
        }

        if (searchParams.ordenNumber) {
            where.OR.push({ ordenNumber: { equals: Number(searchParams.ordenNumber) } });
        }

        if (searchParams.juzgado) {
            where.OR.push({ juzgado: { identifier: { startsWith: searchParams.juzgado, mode: "insensitive" } } });
        }

        if (searchParams.instrumentType) {
            where.OR.push({ instrumentoType: { identifier: { startsWith: searchParams.instrumentType, mode: "insensitive" } } });
        }

        // Si no hay condiciones en el "OR", eliminamos el campo
        if (where.OR.length === 0) {
            delete where.OR;
        }
        return where;
    }



    async getTotalPagesInstrumentosPaginated(searchParams: SearchParamsInstrumentos) {


        const where = this.filters(searchParams);





        const instrumentosCountPromise = await this.modelClient.count({
            where,
        });

        const [instrumentosCount] = await Promise.all([instrumentosCountPromise]);

        const totalPages = Math.ceil(instrumentosCount / this.itemsPerPage);

        return totalPages;
    }

    async getInstrumentosPaginated(searchParams: SearchParamsInstrumentos, page: number) {
        const where = this.filters(searchParams);

        // Realizar la consulta con Prisma
        const instrumentos = await this.modelClient.findMany({
            where,
            skip: (page - 1) * this.itemsPerPage,
            take: this.itemsPerPage,
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

        return instrumentos;
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

    async calculateOrdenNumber(juzgadoIdentifier: string): Promise<number> {
        const maxOrden = await this.modelClient.aggregate({
            _max: {
                ordenNumber: true, // Obtén el máximo valor de ordenNumber
            },
            where: {
                juzgado: {
                    identifier: juzgadoIdentifier,
                },
            },
        });

        // Si no hay valores (primer instrumento), empieza desde 1
        return (maxOrden._max.ordenNumber || 0) + 1;
    }

    async createInstrumento(data: InstrumentoDTO): Promise<InstrumentoExtendido> {
        // Espera a que `ordenNumber` sea calculado antes de usarlo
        const ordenNumber = await this.calculateOrdenNumber(data.juzgadoIdentifier);

        // Ahora puedes usar el valor numérico resuelto
        const creado = await this.modelClient.create({
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
            }
        });

        return creado;
    }


    async updateInstrumento(
        juzgadoId: number,
        ordenNumber: number,
        data: Partial<InstrumentoDTO>
    ): Promise<InstrumentoExtendido | null> {

        let newOrdenNumber = ordenNumber;

        const juzgado = await prisma.juzgado.findUnique({
            where: {
                id: juzgadoId,
            },
        });


        if (data.juzgadoIdentifier !== juzgado?.identifier && data.juzgadoIdentifier) {
            const ordenNumber = await this.calculateOrdenNumber(data.juzgadoIdentifier);
            newOrdenNumber = ordenNumber;
        }


        const update = await this.modelClient.update({
            where: {
                juzgadoId_ordenNumber: {
                    juzgadoId,
                    ordenNumber,
                },
            },
            data: {
                entryDate: data.entryDate,
                exitDate: data.exitDate || undefined,
                caratula: data.caratula,
                destinatario: data.destinatario,
                address: data.address,
                ordenNumber: newOrdenNumber,
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
            }
        });

        return update;
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
