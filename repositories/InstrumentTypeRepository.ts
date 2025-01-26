import prisma from "@/lib/db";
import BaseRepository from "./BaseRepository";
import { InstrumentoType } from "@prisma/client";

export default class InstrumentTypeRepository extends BaseRepository<InstrumentoType> {
    constructor() {
        super(prisma.instrumentoType);
    }

    getByName(name: string): Promise<InstrumentoType | null> {
        return this.modelClient.findFirst({
            where: {
                name:
                    { startsWith: name, mode: "insensitive" }
            }
        });
    }

    getByIdentifier(identifier: string): Promise<InstrumentoType | null> {
        return this.modelClient.findFirst({
            where: {
                identifier:
                    { startsWith: identifier, mode: "insensitive" }
            }
        });
    }
}