import prisma from "@/lib/db";
import BaseRepository from "./BaseRepository";
import {  Juzgado } from "@prisma/client";

export default class JuzgadoRepository extends BaseRepository<Juzgado> {
    constructor() {
        super(prisma.juzgado);
    }

    getByName(name: string): Promise<Juzgado | null> {
        return this.modelClient.findFirst({ where: { name } });
    }

    getByIdentifier(identifier: string): Promise<Juzgado | null> {
        return this.modelClient.findFirst({ where: { identifier } });
    }
}