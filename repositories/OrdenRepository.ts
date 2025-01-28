import prisma from "@/lib/db";
import BaseRepository from "./BaseRepository";
import { Orden } from "@prisma/client";

export default class OrdenRepository extends BaseRepository<Orden> {
    constructor() {
        super(prisma.orden);
    }

    getOrden(ordenNumber: number, juzgadoIdentifier: string): Promise<Orden | null> {
        return this.modelClient.findFirst({
            where: {
                ordenNumber, juzgado: {
                    identifier: juzgadoIdentifier,
                }
            }
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

    async createOrden(juzgadoIdentifier: string): Promise<Orden | null> {
        const maxOrden =await this.calculateOrdenNumber(juzgadoIdentifier);

        return this.modelClient.create({
            data: {
                ordenNumber: maxOrden,
                juzgado: {
                    connect: {
                        identifier: juzgadoIdentifier,
                    },
                },
            },
        });


    }
}