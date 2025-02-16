import InstrumentosRepository from "@/repositories/InstrumentosRepository";
import EntregasRepository from "@/repositories/EntregasRepository";
import ZoneRepository from "@/repositories/ZoneRepository";
import AgenteRepository from "@/repositories/AgentesRepository";

export default class EstadisticaService {

    constructor(zoneRepository: ZoneRepository, entregasRepository: EntregasRepository, instrumentoRepository: InstrumentosRepository, agenteRepository: AgenteRepository) {
        this.zoneRepository = zoneRepository;
        this.entregasRepository = entregasRepository;
        this.instrumentoRepository = instrumentoRepository;
        this.agenteRepository = agenteRepository;
    }

    zoneRepository: ZoneRepository;
    entregasRepository: EntregasRepository;
    instrumentoRepository: InstrumentosRepository;
    agenteRepository: AgenteRepository;


    async getTotalZones() {
        return this.zoneRepository.getTotalZones();
    }

    async getEntregasHistoricalActivity() {
        return this.entregasRepository.getHistoricalActivity();
    }

    async getEntregasRecentActivity() {
        return this.entregasRepository.getRecentActivity();
    }

    async getTotalInstrumentos(zoneName?: string, agenteId?: number) {
        return this.instrumentoRepository.getTotalInstrumentos(zoneName, agenteId);
    }

    async getInstrumentosActivos(zoneName?: string, agenteId?: number) {
        return this.instrumentoRepository.getInstrumentosActivos(zoneName, agenteId);
    }

    async getAgentGrowht() {
        return this.agenteRepository.getAgentGrowth();
    }

    async getInstrumentosPorEstado(zoneName?: string, agenteId?: number) {
        return this.instrumentoRepository.getInstrumentosPorEstado(zoneName, agenteId);
    }

    async getInstrumentosEntregadosUltimosSeisMeses(zoneName?: string, agenteId?: number) {
        return this.instrumentoRepository.getInstrumentosEntregadosUltimosSeisMeses(zoneName, agenteId);
    }



}