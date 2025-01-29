import prisma from "@/lib/db";
import BaseRepository from "./BaseRepository";
import { Instrumento } from "@prisma/client";
import { InstrumentoDTO, InstrumentoExtendido } from "@/types/instrumentoTypes";
import SearchParamsInstrumentos from "@/types/searchParams";
import OrdenRepository from "./OrdenRepository";


const selectOptions = {
    fecha_de_ingreso: true,
    fecha_de_salida: true,
    caratula: true,
    destinatario: true,
    domicilio_denunciado: true,
    ordenId: true,
    instrumentoTypeId: true,
    orden: {
        select: {
            ordenNumber: true,
            juzgado: {
                select: {
                    identifier: true,
                    name: true,
                }
            }
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
    ordenRepository: OrdenRepository;
    constructor(
        ordenRepository: OrdenRepository
    ) {
        super(prisma.instrumento);
        this.ordenRepository = ordenRepository;
    }


    itemsPerPage = 10;


    filters(searchParams: SearchParamsInstrumentos) {

        const parseString = (value: string) => value.replace(/\+/g, " ");


        // Mapeo de las claves de `searchParams` a sus correspondientes condiciones
        const filterMapping: { [key: string]: (value: any) => any } = {
            entryDate: (value) => ({ fecha_de_ingreso: { gte: new Date(value) } }),
            exitDate: (value) => ({ fecha_de_salida: { lte: new Date(value) } }),
            caratula: (value) => ({ caratula: { startsWith: parseString(value), mode: "insensitive" } }),
            destinatario: (value) => ({ destinatario: { startsWith: parseString(value), mode: "insensitive" } }),
            address: (value) => ({ domicilio_denunciado: { startsWith: parseString(value), mode: "insensitive" } }),
            ordenNumber: (value) => ({ orden: { ordenNumber: { equals: Number(value) } } }),
            juzgado: (value) => ({ orden: { juzgado: { identifier: { startsWith: parseString(value), mode: "insensitive" } } } }),
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


    async getInstrumentoByCaratula(caratula:string): Promise<InstrumentoExtendido | null> {
        return this.modelClient.findFirst({
            where: {
                caratula: {
                    equals: caratula,
                    mode: "insensitive",
                }
            },
            select: selectOptions,
        });
    }

    async getInstrumento(juzgadoIdentifier: string, caratula: string, destinatario: string): Promise<InstrumentoExtendido | null> {
        return this.modelClient.findFirst({
            where: {
                caratula: {
                    startsWith: caratula,
                    mode: "insensitive",
                },
                destinatario: {
                    startsWith: destinatario,
                    mode: "insensitive",
                },
                orden: {
                    juzgado: {
                        identifier: juzgadoIdentifier,
                    },
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



    async createInstrumento(data: InstrumentoDTO): Promise<InstrumentoExtendido> {
        const orden = await this.ordenRepository.createOrden(data.juzgadoIdentifier);

        if (!orden) {
            throw new Error("No se pudo crear la orden");
        }

        try {
            const instrumento = await this.modelClient.create({
                data: {
                    fecha_de_ingreso: data.fecha_de_ingreso,
                    fecha_de_salida: data.fecha_de_salida || undefined,
                    caratula: data.caratula,
                    destinatario: data.destinatario,
                    domicilio_denunciado: data.domicilio_denunciado,
                    orden: {
                        connect: {
                            id: orden.id
                        }
                    },
                    instrumentoType: {
                        connect: {
                            identifier: data.instrumentoTypeIdentifier,
                        },
                    },
                },
                select: selectOptions
            });



            return instrumento;
        } catch (error) {
            console.warn(error);
            throw new Error("No se pudo crear el instrumento");

        }


    }


    async updateInstrumento(
        juzgadoIdentifier: string,
        ordenNumber: number,
        data: Partial<InstrumentoDTO>
    ): Promise<InstrumentoExtendido | null> {

        let newOrden = null;

        const juzgado = await prisma.juzgado.findUnique({
            where: {
                identifier: juzgadoIdentifier,
            },
        });
        if (!juzgado) {
            throw new Error("No se encontró el juzgado");
        }

        const ordenActual = await this.ordenRepository.getOrden(ordenNumber, juzgado.identifier);

        if (data.juzgadoIdentifier && juzgado.identifier !== data.juzgadoIdentifier) {
            newOrden = await this.ordenRepository.createOrden(data.juzgadoIdentifier);
        } else {
            newOrden = ordenActual
        }

        const update = await this.modelClient.update({
            where: {
                ordenId: ordenActual?.id,
            },
            data: {
                fecha_de_ingreso: data.fecha_de_ingreso,
                fecha_de_salida: data.fecha_de_salida || undefined,
                caratula: data.caratula,
                destinatario: data.destinatario,
                domicilio_denunciado: data.domicilio_denunciado,
                orden: {
                    connect: {
                        id: newOrden?.id,

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

    async deleteInstrumento(juzgadoIdentifier: string, ordenNumber: number): Promise<Instrumento | null> {
        const ordenActual = await this.ordenRepository.getOrden(ordenNumber, juzgadoIdentifier);

        return this.modelClient.update({
            where: {
                ordenId: ordenActual?.id,
            },
            data: {
                deletedAt: new Date(),
                deleted: true,
            },
        });
    }

    async createInstrumentos(instrumentos: InstrumentoDTO[]) {
        const instrumentosCreados: InstrumentoExtendido[] = [];
        instrumentos.forEach(async instrumento => {
            const result = await this.createInstrumento(instrumento);
            instrumentosCreados.push(result);
        });

        return instrumentosCreados;
    }


}
