import prisma from "@/lib/db";
import BaseRepository from "./BaseRepository";
import { Instrumento } from "@prisma/client";
import { InstrumentoDTO, InstrumentoExtendido } from "@/types/instrumento";

export default class InstrumentosRepository extends BaseRepository<Instrumento> {
    constructor() {
        super(prisma.instrumento);
    }


    async getInstrumentosPaginated(query: string, page: number){

        const querys = query.split("&");
        const querysMap = querys.map((query) => {
            const [key, value] = query.split("=");
            return {key, value};
        });

        const itemsPerPage = 5;


       

        const instrumentosPromise = await this.modelClient.findMany({
            skip: (page - 1) * itemsPerPage,
            take: itemsPerPage,
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

        
        const instrumentosCountPromise = await this.modelClient.count({});


        const [instrumentos, instrumentosCount] = await Promise.all([instrumentosPromise, instrumentosCountPromise]);


        const totalPages = Math.ceil(instrumentosCount / itemsPerPage);


        return {instrumentos, totalPages};
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
        const creado= await this.modelClient.create({
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
            select : {
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


        if(data.juzgadoIdentifier !== juzgado?.identifier && data.juzgadoIdentifier){ 
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
                ordenNumber: newOrdenNumber ,
                juzgado: {
                    connect: {
                        identifier: data.juzgadoIdentifier,
                    },
                },

                instrumentoType : {
                    connect: {
                        identifier: data.instrumentoTypeIdentifier,
                    },
                },  
            },
            select : {
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
