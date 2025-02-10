
import InstrumentTypeRepository from "@/repositories/InstrumentTypeRepository";
import { InstrumentoTypeDTO } from "@/types/instrumentoTypes";
import { InstrumentoType, Prisma } from "@prisma/client";

export default class InstrumentosTypeService {

    constructor(instrumentosTypeRepository: InstrumentTypeRepository) {
        this.instrumentosTypeRepository = instrumentosTypeRepository;
    }

    instrumentosTypeRepository: InstrumentTypeRepository;



    async getTypes() {
        return this.instrumentosTypeRepository.getAll();
    }

    async getInstrumentTypes() {
        return this.instrumentosTypeRepository.getAll();
    }

    async createType(data: Prisma.InstrumentoTypeCreateInput) {
        return this.instrumentosTypeRepository.create(data);
    }

    async getDto(Type: InstrumentoType) {
        const TypeDto: InstrumentoTypeDTO = {
            id: Type.id,
            name: Type.name,
            identifier: Type.identifier,
            createdAt: Type.createdAt,
            updatedAt: Type.updatedAt
        }
        return TypeDto;
    }

    async updateType(id: number, data: Prisma.InstrumentoTypeUpdateInput) {
        return this.instrumentosTypeRepository.update(id, data);
    }

    async deleteType(id: number) {
        return this.instrumentosTypeRepository.delete(id);
    }

    async getTypesPaginated(page: number, query: string) {
        return this.instrumentosTypeRepository.getTypesPaginated(page, this._parseQuery(query));
    }

    async getTotalPages(query: string) {
        return this.instrumentosTypeRepository.getTotalPages(this._parseQuery(query));
    }

    _parseQuery(query: string) {
        return query.replace(/\+/g, " ");
    }

}