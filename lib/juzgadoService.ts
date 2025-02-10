
import JuzgadoRepository from "@/repositories/JuzgadoRepository";
import { Juzgado, Prisma } from "@prisma/client";

export default class JuzgadoService {

    constructor(juzgadosRepository: JuzgadoRepository) {
        this.juzgadosRepository = juzgadosRepository;
    }

    juzgadosRepository: JuzgadoRepository;



    async getJuzgados() {
        return this.juzgadosRepository.getAll();
    }

    async getInstrumentTypes() {
        return this.juzgadosRepository.getAll();
    }

    async createJuzgado(data: Prisma.JuzgadoCreateInput) {
        return this.juzgadosRepository.create(data);
    }

    async getDto(juzgado: Juzgado) {
        const juzgadoDto: JuzgadoDto = {
            id: juzgado.id,
            name: juzgado.name,
            identifier: juzgado.identifier,
            createdAt: juzgado.createdAt,
            updatedAt: juzgado.updatedAt
        }

        return juzgadoDto;
    }

    async updateJuzgado(id: number, data: Prisma.JuzgadoUpdateInput) {
        return this.juzgadosRepository.update(id, data);
    }

    async deleteJuzgado(id: number) {
        return this.juzgadosRepository.delete(id);
    }

    async getJuzgadosPaginated(page: number, query: string) {
        return this.juzgadosRepository.getJuzgadosPaginated(page, this._parseQuery(query));
    }

    async getTotalPages(query: string) {
        return this.juzgadosRepository.getTotalPages(this._parseQuery(query));
    }

    _parseQuery(query: string) {
        return query.replace(/\+/g, " ");
    }

}