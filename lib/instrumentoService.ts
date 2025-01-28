import InstrumentosRepository from "@/repositories/InstrumentosRepository";
import InstrumentTypeRepository from "@/repositories/InstrumentTypeRepository";
import JuzgadoRepository from "@/repositories/JuzgadoRepository";
import { InstrumentoDTO, InstrumentPDFDTO } from "@/types/instrumentoTypes";
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

        const instrumentoTypeParsed = instrumento.tramite.split(" ")[0];
        console.log(instrumentoTypeParsed);

        const instrumentoTypePromise = this.instrumentoTypeRepository.getByName(instrumentoTypeParsed);

        const [juzgado, instrumentoType] = await Promise.all([juzgadoPromise, instrumentoTypePromise]);

       

        return {
            fecha_de_ingreso: new Date(instrumento.altaDisponibilidad),
            fecha_de_salida: null,
            caratula: instrumento.caratula,
            destinatario: instrumento.destinatario,
            domicilio_denunciado: instrumento.domicilio,
            juzgadoIdentifier: juzgado?.identifier ?? "",
            instrumentoTypeIdentifier: instrumentoType?.identifier ?? "",
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

    async createInstrumentos(instrumentos: InstrumentoDTO[]) {
        const created = await this.instrumentoRepository.createInstrumentos(instrumentos);
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

    async deleteDuplicatePdfEntries(instrumentos: InstrumentPDFDTO[]) {
        const filteredInstrument: InstrumentoDTO[] = [];
        const instrumentosWithErrors: InstrumentoDTO[] = [];
    
        // Procesa todos los instrumentos en paralelo
        await Promise.all(
            instrumentos.map(async (instrumento) => {
                try {
                    const instrumentoDto = await this.getInstrumentoDto(instrumento);
                    
                    // Revisa si el juzgado y el tipo de instrumento son válidos
                    if ( instrumentoDto.juzgadoIdentifier === "" || instrumentoDto.instrumentoTypeIdentifier === "") {
                        instrumentosWithErrors.push(instrumentoDto);
                        return;
                    }
    
                    // Verifica si el instrumento ya existe en la base de datos
                    const isInDb = await this.instrumentoRepository.getInstrumento(
                        instrumentoDto.juzgadoIdentifier,
                        instrumentoDto.caratula,
                        instrumentoDto.destinatario
                    );
    
                    if (!isInDb) {
                        filteredInstrument.push(instrumentoDto);
                    }
                } catch (e) {
                    console.error(`Error procesando instrumento: ${instrumento.caratula}. Error: ${(e as Error).message}`);
                }
            })
        );
    
        return { filteredInstrument, instrumentosWithErrors };
    }


}