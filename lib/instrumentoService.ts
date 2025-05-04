import InstrumentosRepository from "@/repositories/InstrumentosRepository";
import InstrumentTypeRepository from "@/repositories/InstrumentTypeRepository";
import JuzgadoRepository from "@/repositories/JuzgadoRepository";
import { InstrumentoDTO, InstrumentoDtoWithError, InstrumentPDFDTO } from "@/types/instrumentoTypes";
import SearchParamsInstrumentos from "@/types/searchParams";
import { EstadoInstrumento, InstrumentoType, Juzgado, TipoCarga } from "@prisma/client";

export default class InstrumentoService {

    constructor(juzgadosRepository: JuzgadoRepository, instrumentoTypeRepository: InstrumentTypeRepository, instrumentoRepository: InstrumentosRepository) {
        this.juzgadosRepository = juzgadosRepository;
        this.instrumentoTypeRepository = instrumentoTypeRepository;
        this.instrumentoRepository = instrumentoRepository;
    }

    juzgadosRepository: JuzgadoRepository;
    instrumentoTypeRepository: InstrumentTypeRepository;
    instrumentoRepository: InstrumentosRepository;


    _mensajeError(juzgado: Juzgado | null, instrumentoType: InstrumentoType | null): string {
        if (!juzgado && !instrumentoType) return "Juzgado y tipo de instrumento inválidos";
        else if (!juzgado) return "Juzgado inválido";
        else if (!instrumentoType) return "Tipo de instrumento inválido";
        else return "Error desconocido"
    }

    async getInstrumentoDto(instrumento: InstrumentPDFDTO): Promise<InstrumentoDTO | InstrumentoDtoWithError> {
        const juzgadoPromise = this.juzgadosRepository.getByName(instrumento.organismo);
        const instrumentoTypeParsed = instrumento.tramite.split(" ")[0];
        const instrumentoTypePromise = this.instrumentoTypeRepository.getByName(instrumentoTypeParsed);
        const [juzgado, instrumentoType] = await Promise.all([juzgadoPromise, instrumentoTypePromise]);

        if (!juzgado || !instrumentoType) {
            return {    
                fecha_de_ingreso: new Date(instrumento.altaDisponibilidad),
                fecha_de_salida: null,
                caratula: instrumento.caratula,
                urgencia: instrumento.estado === "URGENTE" ? "URGENTE" : "NORMAL",
                domicilio_denunciado: instrumento.destinatarioPostal,
                juzgadoIdentifier: juzgado?.identifier ?? "No encontrado",
                instrumentoTypeIdentifier: instrumentoType?.identifier ?? "No nomenclado" ,
                error: this._mensajeError(juzgado, instrumentoType),
                tipoDeCarga: TipoCarga.PDF,
                codigo: instrumento.codigo,
                estado: EstadoInstrumento.PENDIENTE_DE_NOTIFICAR,
                observaciones: "",
                punto: null,
                zona: null,
                subZona: null

            };
        }

        return {
            fecha_de_ingreso: new Date(instrumento.altaDisponibilidad),
            fecha_de_salida: null,
            caratula: instrumento.caratula,
            urgencia: instrumento.estado === "URGENTE" ? "URGENTE" : "NORMAL",
            domicilio_denunciado: instrumento.destinatarioPostal,
            juzgadoIdentifier: juzgado.identifier,
            instrumentoTypeIdentifier: instrumentoType.identifier,
            tipoDeCarga: TipoCarga.PDF,
            estado: EstadoInstrumento.PENDIENTE_DE_NOTIFICAR,
            codigo: instrumento.codigo,
            observaciones: "",
            punto: null,
            zona: null,
            subZona: null
        };


    }

    async getInstrumentos() {
        return this.instrumentoRepository.getAll();
    }

    async getInstrumentoByCode(code: string, tipoDeCarga?: TipoCarga) {
        return this.instrumentoRepository.getInstrumentoByCode(code, tipoDeCarga);
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

    async deleteInstrumento(juzgadoIdentifier: string, ordenNumber: number) {
        const deleted = await this.instrumentoRepository.deleteInstrumento(juzgadoIdentifier, ordenNumber);
        return deleted;
    }

    async updateInstrumento(juzgadoIdentifier: string, ordenNumber: number, data: InstrumentoDTO) {
        const updated = await this.instrumentoRepository.updateInstrumento(juzgadoIdentifier, ordenNumber, data);
        return updated;
    }

    async deleteDuplicatePdfEntries(instrumentos: InstrumentPDFDTO[]) {
        try {
            const instrumentPromises = instrumentos.map(async (instrumento) => {
                try {
                    const instrumentoDto = await this.getInstrumentoDto(instrumento);

                    const isInDb = await this.instrumentoRepository.getInstrumentoByCode(
                        instrumentoDto.codigo,
                        instrumentoDto.tipoDeCarga
                    );

                    if (isInDb) {
                       return; // Skip if already in DB
                    }

                    return instrumentoDto;
                } catch (e) {
                    console.error(`Error procesando instrumento: ${instrumento.caratula}. Error: ${(e as Error).message}`);
                    return {
                        fecha_de_ingreso: new Date(instrumento.altaDisponibilidad),
                        fecha_de_salida: null,
                        caratula: instrumento.caratula,
                        urgencia: instrumento.estado === "URGENTE" ? "URGENTE" : "NORMAL",
                        domicilio_denunciado: instrumento.destinatarioPostal,
                        juzgadoIdentifier: "Error",
                        instrumentoTypeIdentifier: "Error",
                        error: `Error procesando instrumento: ${(e as Error).message}`,
                        tipoDeCarga: TipoCarga.PDF,
                        codigo: instrumento.codigo,
                        estado: EstadoInstrumento.PENDIENTE_DE_NOTIFICAR,
                        observaciones: "",
                        punto: null,
                        zona: null,
                        subZona: null
                    } as InstrumentoDtoWithError;
                }
            });

            // Process all instrument promises concurrently
            // and filter out undefined results (already in DB)
            const processedInstruments = await Promise.all(instrumentPromises);

            // Filter out undefined results (already in DB)

            const processedInstrumentsFiltered: (InstrumentoDTO|InstrumentoDtoWithError)[] = processedInstruments.filter((instrumento) => instrumento !== undefined);

            return processedInstrumentsFiltered;
        } catch (error) {
            console.error("Error general en deleteDuplicatePdfEntries:", (error as Error).message);
            return [];
        }
    }



    async getInstrumentosByZone(zone: string) {
        return this.instrumentoRepository.getInstrumentosByZone(zone);
    }




    async getInstrumentosAEntregar(zones: string[]) {

        const promises = zones.map(zone => this.instrumentoRepository.getInstrumentosAEntregarPorZonas(zone));
        const instrumentos = await Promise.all(promises);

        return instrumentos.flat();
    }


    async getInstrumentosPaginatedByAgent(searchParams: SearchParamsInstrumentos, page: number, agentId: number) {
        const instrumentos = await this.instrumentoRepository.getInstrumentosByAgentPaginated(agentId, searchParams, page);
        return instrumentos;
    }

    async getTotalPagesInstrumentosPaginatedByAgent(searchParams: SearchParamsInstrumentos, agentId: number) {
        const totalPages = await this.instrumentoRepository.getTotalPagesInstrumentosByAgentPaginated(agentId, searchParams);
        return totalPages;
    }

    async getInstrumentosByAgent(searchParams: SearchParamsInstrumentos, agentId: number) {
        return this.instrumentoRepository.getInstrumentosByAgent(agentId, searchParams);
    }

    async getInstrumentosByAgentCreatedDate(agentId: number, startDate: Date, finishDate: Date) {
        return this.instrumentoRepository.getInstrumentosByAgentCreatedDate(agentId, startDate, finishDate);
    }


}