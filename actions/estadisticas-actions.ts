"use server";

import EstadisticaService from "@/lib/estadisticasService";
import AgenteRepository from "@/repositories/AgentesRepository";
import EntregasRepository from "@/repositories/EntregasRepository";
import InstrumentosRepository from "@/repositories/InstrumentosRepository";
import OrdenRepository from "@/repositories/OrdenRepository";
import UserRepository from "@/repositories/UserRepository";
import ZoneRepository from "@/repositories/ZoneRepository";

const entregaInstrumentosRepo = new EntregasRepository();
const zoneRepo = new ZoneRepository();
const ordenRepo = new OrdenRepository();
const instrumentoRepo = new InstrumentosRepository(ordenRepo);
const agenteRepo = new AgenteRepository(
    new UserRepository()
);



const estadisticaService = new EstadisticaService(
    zoneRepo,
    entregaInstrumentosRepo,
    instrumentoRepo,
    agenteRepo
);

export async function getTotalZones() {
    return estadisticaService.getTotalZones();
}

export async function getEntregasHistoricalActivity() {
    return estadisticaService.getEntregasRecentActivity();
}

export async function getEntregasRecentActivity() {
    return estadisticaService.getEntregasRecentActivity();
}

export async function getTotalInstrumentos(zoneName?: string, agenteId?: number) {
    return estadisticaService.getTotalInstrumentos(zoneName, agenteId);
}

export async function getInstrumentosActivos(zoneName?: string, agenteId?: number) {
    return estadisticaService.getInstrumentosActivos(zoneName, agenteId);
}

export async function getAgentGrowht(){
    return estadisticaService.getAgentGrowht();
}

export async function getInstrumentosPorEstado(zoneName?: string, agenteId?: number){
    return estadisticaService.getInstrumentosPorEstado(zoneName, agenteId);
}

export async function getInstrumentosEntregadosUltimosSeisMeses(zoneName?: string, agenteId?: number){
    return estadisticaService.getInstrumentosEntregadosUltimosSeisMeses(zoneName, agenteId);
}

