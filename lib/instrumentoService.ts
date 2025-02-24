import InstrumentosRepository from "@/repositories/InstrumentosRepository";
import InstrumentTypeRepository from "@/repositories/InstrumentTypeRepository";
import JuzgadoRepository from "@/repositories/JuzgadoRepository";
import { InstrumentoDTO, InstrumentoDtoWithError, InstrumentPDFDTO } from "@/types/instrumentoTypes";
import SearchParamsInstrumentos from "@/types/searchParams";
import { parseDataToYear } from "./utils";
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
                fecha_de_ingreso: new Date(parseDataToYear(instrumento.altaDisponibilidad)),
                fecha_de_salida: null,
                caratula: instrumento.caratula,
                urgencia: instrumento.estado === "URGENTE" ? "URGENTE" : "NORMAL",
                domicilio_denunciado: instrumento.destinatarioPostal,
                juzgadoIdentifier: juzgado?.identifier ?? instrumento.organismo,
                instrumentoTypeIdentifier: instrumentoType?.identifier ?? instrumentoTypeParsed,
                error: this._mensajeError(juzgado, instrumentoType),
                tipoDeCarga: TipoCarga.PDF,
                codigo: instrumento.codigo,
                estado: EstadoInstrumento.PENDIENTE_DE_NOTIFICAR,
                observaciones: ""

            };
        }

        return {
            fecha_de_ingreso: new Date(parseDataToYear(instrumento.altaDisponibilidad)),
            fecha_de_salida: null,
            caratula: instrumento.caratula,
            urgencia: instrumento.estado === "URGENTE" ? "URGENTE" : "NORMAL",
            domicilio_denunciado: instrumento.destinatarioPostal,
            juzgadoIdentifier: juzgado.identifier,
            instrumentoTypeIdentifier: instrumentoType.identifier,
            tipoDeCarga: TipoCarga.PDF,
            estado: EstadoInstrumento.PENDIENTE_DE_NOTIFICAR,
            codigo: instrumento.codigo,
            observaciones: ""
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
        const filteredInstrument: InstrumentoDTO[] = [];
        const instrumentosWithErrors: InstrumentoDtoWithError[] = [];

        try {
            // Procesa todos los instrumentos en paralelo
            await Promise.all(
                instrumentos.map(async (instrumento) => {
                    try {
                        const instrumentoDto = await this.getInstrumentoDto(instrumento);


                        // Verifica si el instrumento ya existe en la base de datos
                        const isInDb = await this.instrumentoRepository.getInstrumentoByCode(instrumentoDto.codigo, instrumentoDto.tipoDeCarga)

                        if (isInDb) return;



                        // Revisa si el juzgado y el tipo de instrumento son válidos
                        if ("error" in instrumentoDto) {
                            instrumentosWithErrors.push(instrumentoDto);
                        } else {
                            filteredInstrument.push(instrumentoDto);
                        }
                        return;
                    } catch (e) {
                        console.error(`Error procesando instrumento: ${instrumento.caratula}. Error: ${(e as Error).message}`);
                    }
                })
            );
        } catch (error) {
            console.error("Error general en deleteDuplicatePdfEntries:", (error as Error).message);
        }

        return { filteredInstrument, instrumentosWithErrors };
    }


    async getInstrumentosByZone(zone: string) {
        return this.instrumentoRepository.getInstrumentosByZone(zone);
    }




    async getInstrumentosAEntregar(zones: string[]) {

        const promises = zones.map(zone => this.instrumentoRepository.getInstrumentosAEntregarPorZonas(zone));
        const instrumentos = await Promise.all(promises);

        return instrumentos.flat();


    }


}