import InstrumentosRepository from "@/repositories/InstrumentosRepository";
import InstrumentTypeRepository from "@/repositories/InstrumentTypeRepository";
import JuzgadoRepository from "@/repositories/JuzgadoRepository";
import { InstrumentoDTO, InstrumentPDFDTO } from "@/types/instrumento";
import SearchParamsInstrumentos from "@/types/searchParams";

export default class InstrumentoService {

    constructor(juzgadosRepository: JuzgadoRepository, instrumentoTypeRepository: InstrumentTypeRepository, instrumentoRepository: InstrumentosRepository) {
        this.juzgadosRepository = juzgadosRepository;
        this.instrumentoTypeRepository = instrumentoTypeRepository;
        this.instrumentoRepository = instrumentoRepository;
    }

    juzgadosRepository: JuzgadoRepository;
    instrumentoTypeRepository: InstrumentTypeRepository;
    instrumentoRepository: InstrumentosRepository;


    async getInstrumentoDto(instrumento: InstrumentPDFDTO): Promise<InstrumentoDTO> {
        console.log(instrumento);
        const juzgadoPromise = this.juzgadosRepository.getByName(instrumento.organismo);
        const instrumentoTypePromise = this.instrumentoTypeRepository.getByName(instrumento.tramite);

        const [juzgado, instrumentoType] = await Promise.all([juzgadoPromise, instrumentoTypePromise]);

        if (!juzgado || !instrumentoType) {
            throw new Error("No se encontró el juzgado o el tipo de instrumento");
        }

        return {
            entryDate: new Date(instrumento.altaDisponibilidad),
            exitDate: null,
            caratula: instrumento.caratula,
            destinatario: instrumento.destinatario,
            address: instrumento.domicilio,
            juzgadoIdentifier: juzgado.identifier,
            instrumentoTypeIdentifier: instrumentoType.identifier,
        };


    }

    async getInstrumentos() {
        return this.instrumentoRepository.getAll();
    }

    async getInstrumentosPaginated(searchParams: SearchParamsInstrumentos, page: number) {
        const instrumentos = await this.instrumentoRepository.getInstrumentosPaginated(searchParams, page);
        return instrumentos;
    }

    async getTotalPagesInstrumentosPaginated(searchParams: SearchParamsInstrumentos) {
        const totalPages = await this.instrumentoRepository.getTotalPagesInstrumentosPaginated(searchParams);
        return totalPages;
    }

    async createInstrumento(data: InstrumentoDTO) {
        const instrumento = await this.instrumentoRepository.createInstrumento(data);
        return instrumento;

    }

    async createInstrumentoFromPDF(instrumento: InstrumentPDFDTO) {
        const instrumentoDto = await this.getInstrumentoDto(instrumento);
        const created = await this.createInstrumento(instrumentoDto);
        return created;
    }

    async deleteInstrumento(juzgadoId: number, ordenNumber: number) {
        const deleted = await this.instrumentoRepository.deleteInstrumento(juzgadoId, ordenNumber);
        return deleted;
    }

    async updateInstrumento(juzgadoId: number, ordenNumber: number, data: InstrumentoDTO) {
        const updated = await this.instrumentoRepository.updateInstrumento(juzgadoId, ordenNumber, data);
        return updated;
    }
}