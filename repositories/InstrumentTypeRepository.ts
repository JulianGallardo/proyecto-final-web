import prisma from "@/lib/db";
import BaseRepository from "./BaseRepository";
import { InstrumentoType } from "@prisma/client";

export default class InstrumentTypeRepository extends BaseRepository<InstrumentoType> {
    constructor() {
        super(prisma.instrumentoType);
    }

    getByName(name: string): Promise<InstrumentoType | null> {
        return this.modelClient.findFirst({ where: { name } });
    }

    getByIdentifier(identifier: string): Promise<InstrumentoType | null> {
        return this.modelClient.findFirst({ where: { identifier } });
    }
}