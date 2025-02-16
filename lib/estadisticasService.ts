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

    async getTotalInstrumentos() {
        return this.instrumentoRepository.getTotalInstrumentos();
    }

    async getInstrumentosActivos() {
        return this.instrumentoRepository.getInstrumentosActivos();
    }




}