import prisma from "@/lib/db";
import BaseRepository from "./BaseRepository";
import {  InstrumentoType } from "@prisma/client";

export default class InstrumentType extends BaseRepository<InstrumentoType> {
    constructor() {
        super(prisma.instrumentoType);
    }
}