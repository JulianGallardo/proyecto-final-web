import prisma from "@/lib/db";
import BaseRepository from "./BaseRepository";
import { Instrumento } from "@prisma/client";
import { InstrumentoDTO, InstrumentoExtendido } from "@/types/instrumentoTypes";
import SearchParamsInstrumentos from "@/types/searchParams";


const selectOptions = {
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
};



export default class InstrumentosRepository extends BaseRepository<Instrumento> {
    constructor() {
        super(prisma.instrumento);
    }

    itemsPerPage = 10;


    filters(searchParams: SearchParamsInstrumentos) {

        const parseString = (value: string) => value.replace(/\+/g, " ");


        // Mapeo de las claves de `searchParams` a sus correspondientes condiciones
        const filterMapping: { [key: string]: (value: any) => any } = {
            entryDate: (value) => ({ entryDate: { gte: new Date(value) } }),
            exitDate: (value) => ({ exitDate: { lte: new Date(value) } }),
            caratula: (value) => ({ caratula: { startsWith: parseString(value), mode: "insensitive" } }),
            destinatario: (value) => ({ destinatario: { startsWith: parseString(value), mode: "insensitive" } }),
            address: (value) => ({ address: { startsWith: parseString(value), mode: "insensitive" } }),
            ordenNumber: (value) => ({ ordenNumber: { equals: Number(value) } }),
            juzgado: (value) => ({ juzgado: { identifier: { startsWith: parseString(value), mode: "insensitive" } } }),
            instrumentType: (value) => ({ instrumentoType: { identifier: { startsWith: parseString(value), mode: "insensitive" } } }),
        };

        // Construir dinámicamente el objeto "where"
        const where: any = {
            AND: Object.entries(searchParams)
                .map(([key, value]) => {
                    const filterBuilder = filterMapping[key];
                    return filterBuilder ? filterBuilder(value) : null; // Construye la condición si existe en el mapeo
                })
                .filter((condition) => condition !== null), // Elimina las condiciones nulas
        };

        where.AND.push({ deleted: false }); // Añadir condición para mostrar solo los registros no eliminados

        // Si no hay condiciones en el "OR", eliminamos el campo
        if (where.AND.length === 0) {
            delete where.OR;
        }

        return where;
    }


    async getInstrumentoById(juzgadoId: number, ordenNumber: number): Promise<InstrumentoExtendido | null> {
        return this.modelClient.findUnique({
            where: {
                juzgadoId_ordenNumber: {
                    juzgadoId,
                    ordenNumber,
                },
            },
            select: selectOptions,
        });
    }

    async getInstrumento(juzgadoIdentifier: string, caratula: string, destinatario: string): Promise<InstrumentoExtendido | null> {
        return this.modelClient.findFirst({
            where: {
                caratula: caratula,
                destinatario: destinatario,
                juzgado: {
                    identifier: juzgadoIdentifier,
                },
            },
            select: selectOptions,
        });
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
            select: selectOptions,
        });

        return instrumentos;
    }




    async getInstrumentos(): Promise<InstrumentoExtendido[]> {
        return this.modelClient.findMany({
            select: selectOptions,
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

        console.log(data);
        try {
            const creado = await this.modelClient.create({
                data: {
                    entryDate: data.entryDate,
                    exitDate: data.exitDate || undefined,
                    caratula: data.caratula,
                    destinatario: data.destinatario,
                    address: data.address,
                    ordenNumber: ordenNumber,
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
                select: selectOptions
            });

            return creado;

        } catch (error) {
            throw new Error("Ocurrio un error al intentar crear el instrumento, intente de nuevo.");

        }

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
            select: selectOptions
        });

        return update;
    }

    async deleteInstrumento(juzgadoId: number, ordenNumber: number): Promise<Instrumento | null> {
        return this.modelClient.update({
            where: {
                juzgadoId_ordenNumber: {
                    juzgadoId,
                    ordenNumber,
                },
            },
            data: {
                deletedAt: new Date(),
                deleted: true,
            },
        });
    }
}
