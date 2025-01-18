import prisma from "@/lib/db";
import BaseRepository from "./BaseRepository";
import {  InstrumentoType } from "@prisma/client";

export default class InstrumentTypeRepository extends BaseRepository<InstrumentoType> {
    constructor() {
        super(prisma.instrumentoType);
    }
}