import prisma from "@/lib/db";
import BaseRepository from "./BaseRepository";
import { EstadoInstrumento, Instrumento, SubZona, TipoCarga } from "@prisma/client";
import { InstrumentoDTO, InstrumentoExtendido } from "@/types/instrumentoTypes";
import SearchParamsInstrumentos from "@/types/searchParams";
import OrdenRepository from "./OrdenRepository";
import { getCoordinates, getSubzoneInCoords, getZoneInCoords } from "@/lib/locationUtils/zoneUtils";

const selectOptions = {
    codigoInstrumento: true,
    cargaInstrumento: true,
    fecha_de_ingreso: true,
    fecha_de_salida: true,
    caratula: true,
    domicilio_denunciado: true,
    ordenId: true,
    instrumentoTypeId: true,
    orden: {
        select: {
            ordenNumber: true,
            juzgado: {
                select: {
                    identifier: true,
                    name: true,
                },
            },
        },
    },
    instrumentoType: {
        select: {
            name: true,
            identifier: true,
        },
    },
    observaciones: true,
    latitude: true,
    longitude: true,
    createdAt: true,
    updatedAt: true,
    zoneName: true,
    subZona: true,
    estado: true,
    urgencia: true,
    HistorialEntregas: {
        select: {
            fecha_entrega: true,
            observaciones: true,
            estado: true,
            agenteFullName: true,
        },
    },
} as const;

export default class InstrumentosRepository extends BaseRepository<Instrumento> {
    private readonly ordenRepository: OrdenRepository;
    private readonly itemsPerPage = 10;

    constructor(ordenRepository: OrdenRepository) {
        super(prisma.instrumento);
        this.ordenRepository = ordenRepository;
    }

    // Helper to parse strings, removing redundancy
    private parseString(value: string): string {
        return value.replace(/\+/g, " ");
    }

    // Helper to parse and validate date for end of day
    private getEndOfDay(dateQuery: string): Date {
        const [year, month, day] = dateQuery.split("-").map(Number);
        return new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
    }

    // Helper to parse instrument code
    private parseCode(value: string) {
        const parsedValue = this.parseString(value);
        const code = parsedValue.split("-");
        if (code.length !== 2) {
            if (code[0] === "PDF" || code[0] === "MAN") {
                return { type: code[0] as TipoCarga | undefined, number: undefined };
            }
            return { type: undefined, number: code[0] };
        }
        return { type: code[0] as TipoCarga | undefined, number: code[1] };
    }

    // Dynamic filter mapping with type safety
    private readonly filterMapping: {
        [K in keyof SearchParamsInstrumentos]?: (value: string) => Record<string, any>;
    } = {
            desde: (value) => ({ fecha_de_ingreso: { gte: new Date(value) } }),
            hasta: (value) => ({ fecha_de_ingreso: { lte: this.getEndOfDay(value) } }),
            exitDate: (value) =>
                this.parseString(value) === "No registrada"
                    ? { fecha_de_salida: { equals: null } }
                    : { fecha_de_salida: { lte: new Date(value) } },
            caratula: (value) => ({ caratula: { startsWith: this.parseString(value), mode: "insensitive" } }),
            codigo: (value) => {
                const parsedCode = this.parseCode(value);
                return {
                    codigoInstrumento: { startsWith: parsedCode.number, mode: "insensitive" },
                    cargaInstrumento: parsedCode.type,
                };
            },
            address: (value) => ({ domicilio_denunciado: { startsWith: this.parseString(value), mode: "insensitive" } }),
            ordenNumber: (value) => ({ orden: { ordenNumber: { equals: Number(value) } } }),
            juzgado: (value) => ({
                orden: { juzgado: { identifier: { startsWith: this.parseString(value), mode: "insensitive" } } },
            }),
            instrumentType: (value) => ({ instrumentoType: { name: { equals: this.parseString(value), mode: "insensitive" } } }),
            estado: (value) => ({ estado: { equals: value as EstadoInstrumento } }),
            urgencia: (value) => ({ urgencia: { equals: value } }),
            zona: (value) => ({
                zoneName: { equals: this.parseString(value) }
            }),
        };

    // Build Prisma where clause efficiently
    private buildWhereClause(searchParams: SearchParamsInstrumentos): Record<string, any> {
        const conditions = Object.entries(searchParams)
            .map(([key, value]) => {
                const filter = this.filterMapping[key as keyof SearchParamsInstrumentos];
                return filter ? filter(value as string) : null;
            })
            .filter((condition): condition is Record<string, any> => condition !== null);

        return { AND: conditions.length > 0 ? conditions : undefined };
    }

    async getInstrumentosByZone(zoneName: string): Promise<InstrumentoExtendido[]> {
        return this.modelClient.findMany({
            where: { zoneName },
            select: selectOptions,
        });
    }

    async getInstrumentoByCode(code: string, tipoDeCarga?: TipoCarga): Promise<InstrumentoExtendido | null> {
        return this.modelClient.findFirst({
            where: { codigoInstrumento: code, cargaInstrumento: tipoDeCarga },
            select: selectOptions,
        });
    }

    async getInstrumentoByCaratula(caratula: string): Promise<InstrumentoExtendido | null> {
        return this.modelClient.findFirst({
            where: { caratula: { equals: caratula, mode: "insensitive" } },
            select: selectOptions,
        });
    }

    async getInstrumento(juzgadoIdentifier: string, caratula: string, destinatario: string): Promise<InstrumentoExtendido | null> {
        return this.modelClient.findFirst({
            where: {
                caratula: { startsWith: caratula, mode: "insensitive" },
                orden: { juzgado: { identifier: juzgadoIdentifier } },
            },
            select: selectOptions,
        });
    }

    async getTotalPagesInstrumentosPaginated(searchParams: SearchParamsInstrumentos): Promise<number> {
        const where = this.buildWhereClause(searchParams);
        const count = await this.modelClient.count({ where });
        return Math.ceil(count / this.itemsPerPage);
    }

    async getInstrumentosPaginated(searchParams: SearchParamsInstrumentos, page: number): Promise<InstrumentoExtendido[]> {
        const where = this.buildWhereClause(searchParams);

        return this.modelClient.findMany({
            where,
            skip: (page - 1) * this.itemsPerPage,
            take: this.itemsPerPage,
            select: selectOptions,
            orderBy: [
                { fecha_de_salida: { sort: "asc", nulls: "first" } },
                { fecha_de_ingreso: "asc" },
            ],
        });
    }

    async getInstrumentosByAgentPaginated(agentId: number, searchParams: SearchParamsInstrumentos, page: number): Promise<InstrumentoExtendido[]> {
        const where = this.buildWhereClause(searchParams);

        // Get the agent's zones
        const agentZones = await prisma.agente.findUnique({
            where: { id: agentId },
            select: { zonas: { select: { zoneName: true } } },
        });

        // Filter by either histogram entries matching the agent OR by the agent's zones
        where['OR'] = [
            { HistorialEntregas: { some: { agenteId: agentId } } },
            agentZones?.zonas?.length ? { zoneName: { in: agentZones.zonas.map(z => z.zoneName) } } : {}
        ];

        return this.modelClient.findMany({
            where,
            skip: (page - 1) * this.itemsPerPage,
            take: this.itemsPerPage,
            select: selectOptions,
            orderBy: [
                { fecha_de_salida: { sort: "asc", nulls: "first" } },
                { fecha_de_ingreso: "asc" },
            ],
        });
    }

    async getTotalPagesInstrumentosByAgentPaginated(agentId: number, searchParams: SearchParamsInstrumentos): Promise<number> {
        const where = this.buildWhereClause(searchParams);

        // Get the agent's zones
        const agentZones = await prisma.agente.findUnique({
            where: { id: agentId },
            select: { zonas: { select: { zoneName: true } } },
        });

        // Filter by either histogram entries matching the agent OR by the agent's zones
        where['OR'] = [
            { HistorialEntregas: { some: { agenteId: agentId } } },
            agentZones?.zonas?.length ? { zoneName: { in: agentZones.zonas.map(z => z.zoneName) } } : {}
        ];

        const count = await this.modelClient.count({ where });
        return Math.ceil(count / this.itemsPerPage);
    }

    async getInstrumentos(): Promise<InstrumentoExtendido[]> {
        return this.modelClient.findMany({
            select: selectOptions,
            orderBy: [
                { fecha_de_salida: { sort: "asc", nulls: "first" } },
                { fecha_de_ingreso: "asc" },
            ],
        });
    }

    async calculateManualCode(): Promise<number> {
        const { _max } = await this.modelClient.aggregate({
            _max: { codigoInstrumento: true },
            where: { cargaInstrumento: TipoCarga.MAN },
        });
        return _max.codigoInstrumento ? parseInt(_max.codigoInstrumento, 10) : 0 + 1;
    }

    private async getNewZoneAndCoordinates(data: Partial<InstrumentoDTO>) {
        let punto: [number, number] | null = null;

        if (data.domicilio_denunciado && data.domicilio_denunciado !== "") {
            punto = await getCoordinates(data.domicilio_denunciado);
        }

        let nuevaZona = undefined;
        let nuevaSubZona: SubZona = SubZona.Sin_SubZona;
        if (punto) {
            nuevaZona = await getZoneInCoords(punto[0], punto[1]);
            if (nuevaZona) {
                const subZonaResult = await getSubzoneInCoords(punto[0], punto[1], nuevaZona.id);
                nuevaSubZona = subZonaResult as SubZona ?? SubZona.Sin_SubZona;
            }
        }
        return { punto, nuevaZona, nuevaSubZona };
    }

    async createInstrumento(data: InstrumentoDTO): Promise<InstrumentoExtendido> {
        const orden = await this.ordenRepository.createOrden(data.juzgadoIdentifier);
        if (!orden) throw new Error("No se pudo crear la orden");

        if (data.tipoDeCarga === TipoCarga.MAN) {
            data.codigo = (await this.calculateManualCode()).toString();
        }

        

        const { punto, nuevaZona, nuevaSubZona } = await this.getNewZoneAndCoordinates(data);

        try {
            return await this.modelClient.create({
                data: {
                    codigoInstrumento: data.codigo,
                    cargaInstrumento: data.tipoDeCarga,
                    fecha_de_ingreso: data.fecha_de_ingreso,
                    fecha_de_salida: data.fecha_de_salida || undefined,
                    caratula: data.caratula,
                    urgencia: data.urgencia,
                    domicilio_denunciado: data.domicilio_denunciado,
                    orden: { connect: { id: orden.id } },
                    instrumentoType: { connect: { identifier: data.instrumentoTypeIdentifier } },
                    latitude: punto ? punto[1] : undefined,
                    longitude: punto ? punto[0] : undefined,
                    observaciones: data.observaciones,
                    subZona: nuevaSubZona,
                    Zona: nuevaZona ? { connect: { zoneName: nuevaZona.zoneName } } : undefined,
                },
                select: selectOptions,
            });
        } catch (error) {
            console.error("Error creating instrument:", error);
            if (orden) await this.ordenRepository.deleteOrden(orden.ordenNumber, data.juzgadoIdentifier);
            throw new Error("No se pudo crear el instrumento");
        }
    }

    async updateInstrumento(juzgadoIdentifier: string, ordenNumber: number, data: Partial<InstrumentoDTO>): Promise<InstrumentoExtendido | null> {
        const juzgado = await prisma.juzgado.findUnique({ where: { identifier: juzgadoIdentifier } });
        if (!juzgado) throw new Error("No se encontró el juzgado");

        const ordenActual = await this.ordenRepository.getOrden(ordenNumber, juzgado.identifier);
        if (!ordenActual) throw new Error("No se encontró la orden");

        let newOrden = ordenActual;
        if (data.juzgadoIdentifier && juzgado.identifier !== data.juzgadoIdentifier) {
            const createdOrden = await this.ordenRepository.createOrden(data.juzgadoIdentifier);
            if (!createdOrden) throw new Error("No se pudo crear la nueva orden");
            newOrden = createdOrden;
        }

        const { punto, nuevaZona, nuevaSubZona } = await this.getNewZoneAndCoordinates(data);

        return this.modelClient.update({
            where: { ordenId: ordenActual.id },
            data: {
                fecha_de_ingreso: data.fecha_de_ingreso,
                fecha_de_salida: data.fecha_de_salida || undefined,
                caratula: data.caratula,
                urgencia: data.urgencia,
                domicilio_denunciado: data.domicilio_denunciado,
                orden: { connect: { id: newOrden.id } },
                Zona: nuevaZona ? { connect: { zoneName: nuevaZona.zoneName } } : undefined,
                subZona: nuevaSubZona,
                instrumentoType: data.instrumentoTypeIdentifier ? { connect: { identifier: data.instrumentoTypeIdentifier } } : undefined,
                latitude: punto ? punto[1] : undefined,
                longitude: punto ? punto[0] : undefined,
                observaciones: data.observaciones,
                estado: data.estado,
            },
            select: selectOptions,
        });
    }

    async deleteInstrumento(juzgadoIdentifier: string, ordenNumber: number): Promise<Instrumento | null> {
        const orden = await this.ordenRepository.getOrden(ordenNumber, juzgadoIdentifier);
        if (!orden) throw new Error("No se encontró la orden");

        return prisma.$transaction(async (prisma) => {
            const instrument = await prisma.instrumento.delete({ where: { ordenId: orden.id } });
            await prisma.orden.delete({ where: { id: orden.id } });
            return instrument;
        });
    }

    async createInstrumentos(instrumentos: InstrumentoDTO[]): Promise<InstrumentoExtendido[]> {
        if (!instrumentos.length) return [];
        const createdInstruments: InstrumentoExtendido[] = [];

        // Group instruments by juzgadoIdentifier
        const groupedByJuzgado = instrumentos.reduce((acc, instrumento) => {
            const juzgado = instrumento.juzgadoIdentifier;
            acc[juzgado] = acc[juzgado] || [];
            acc[juzgado].push(instrumento);
            return acc;
        }, {} as Record<string, InstrumentoDTO[]>);

        return prisma.$transaction(async (prisma) => {
            // Process groups for different juzgados in parallel
            const results = await Promise.all(
                Object.entries(groupedByJuzgado).map(async ([juzgadoIdentifier, instruments]) => {
                    const instrumentsForJuzgado: InstrumentoExtendido[] = [];

                    // Process instruments within the same juzgado sequentially to avoid race conditions
                    for (const instrumento of instruments) {
                        try {
                            // Create or get a unique order for this instrument and juzgado
                            const orden = await this.ordenRepository.createOrden(juzgadoIdentifier);
                            if (!orden) throw new Error(`No se pudo crear la orden para el instrumento en el juzgado ${juzgadoIdentifier}`);

                            if (instrumento.tipoDeCarga === TipoCarga.MAN) {
                                instrumento.codigo = (await this.calculateManualCode()).toString();
                            }

                            const { punto, nuevaZona, nuevaSubZona } = await this.getNewZoneAndCoordinates(instrumento);

                            // Create the instrument with its unique order
                            const createdInstrument = await this.modelClient.create({
                                data: {
                                    codigoInstrumento: instrumento.codigo,
                                    cargaInstrumento: instrumento.tipoDeCarga,
                                    fecha_de_ingreso: instrumento.fecha_de_ingreso,
                                    fecha_de_salida: instrumento.fecha_de_salida || undefined,
                                    caratula: instrumento.caratula,
                                    urgencia: instrumento.urgencia,
                                    domicilio_denunciado: instrumento.domicilio_denunciado,
                                    estado: instrumento.estado,
                                    ordenId: orden.id,
                                    instrumentoTypeId: (await prisma.instrumentoType.findUnique({
                                        where: { identifier: instrumento.instrumentoTypeIdentifier },
                                    }))?.id ?? undefined,
                                    latitude: punto ? punto[1] : undefined,
                                    longitude: punto ? punto[0] : undefined,
                                    observaciones: instrumento.observaciones,
                                    subZona: nuevaSubZona,
                                    zoneName: nuevaZona ? nuevaZona.zoneName : undefined,
                                },
                                select: selectOptions,
                            });

                            instrumentsForJuzgado.push(createdInstrument);
                        } catch (error) {
                            console.error("Error creating instrument:", error);
                            throw new Error(`No se pudo crear el instrumento para el juzgado ${juzgadoIdentifier}`);
                        }
                    }

                    return instrumentsForJuzgado;
                })
            );

            // Flatten the results from all juzgados
            return results.flat();
        });
    }
    private async getZoneAndAgentConditions(zona?: string, agente?: number): Promise<Record<string, any>> {
        const whereConditions: Record<string, any> = {};

        if (zona) {
            whereConditions['zoneName'] = zona;
        } else if (agente) {
            const agentZones = await prisma.agente.findUnique({
                where: { id: agente },
                select: { zonas: { select: { zoneName: true } } },
            });
            if (agentZones?.zonas?.length) {
                whereConditions['zoneName'] = { in: agentZones.zonas.map(z => z.zoneName) };
            }
        }

        return whereConditions;
    }

    async getTotalInstrumentos(zona?: string, agente?: number): Promise<{ total: number; growthPercentage: number }> {
        const whereConditions = await this.getZoneAndAgentConditions(zona, agente);
        const currentDate = new Date();
        const [currentMonthStart, previousMonthStart] = [
            new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
        ];

        const [total, currentMonthCount, previousMonthCount] = await Promise.all([
            this.modelClient.count({ where: whereConditions }),
            this.modelClient.count({ where: { fecha_de_ingreso: { gte: currentMonthStart }, ...whereConditions } }),
            this.modelClient.count({ where: { fecha_de_ingreso: { gte: previousMonthStart, lt: currentMonthStart }, ...whereConditions } }),
        ]);

        const growthPercentage = previousMonthCount > 0
            ? ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100
            : currentMonthCount > 0 ? 100 : 0;

        return { total, growthPercentage };
    }

    async getInstrumentosActivos(zona?: string, agente?: number): Promise<{ totalActivos: number; growthPercentage: number }> {
        const whereConditions = await this.getZoneAndAgentConditions(zona, agente);
        const currentDate = new Date();
        const [currentMonthStart, previousMonthStart] = [
            new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
        ];

        const [totalActivos, currentMonthActivos, previousMonthActivos] = await Promise.all([
            this.modelClient.count({ where: { fecha_de_salida: null, ...whereConditions } }),
            this.modelClient.count({ where: { fecha_de_ingreso: { gte: currentMonthStart }, fecha_de_salida: null, ...whereConditions } }),
            this.modelClient.count({ where: { fecha_de_ingreso: { gte: previousMonthStart, lt: currentMonthStart }, fecha_de_salida: null, ...whereConditions } }),
        ]);

        const growthPercentage = previousMonthActivos > 0
            ? ((currentMonthActivos - previousMonthActivos) / previousMonthActivos) * 100
            : currentMonthActivos > 0 ? 100 : 0;

        return { totalActivos, growthPercentage };
    }

    async getInstrumentosPorEstado(zona?: string, agente?: number): Promise<Record<EstadoInstrumento, number>> {
        const whereConditions = await this.getZoneAndAgentConditions(zona, agente);
        const counts = await Promise.all(
            Object.values(EstadoInstrumento).map(estado =>
                this.modelClient.count({ where: { estado, ...whereConditions } })
            )
        );
        return Object.values(EstadoInstrumento).reduce((acc, estado, index) => {
            acc[estado] = counts[index];
            return acc;
        }, {} as Record<EstadoInstrumento, number>);
    }

    async getInstrumentosEntregadosUltimosSeisMeses(zona?: string, agente?: number): Promise<{ month: string; year: number; count: number }[]> {
        const currentDate = new Date();
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
            const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            return {
                month: months[monthDate.getMonth()],
                year: monthDate.getFullYear(),
                startDate: new Date(monthDate.getFullYear(), monthDate.getMonth(), 1),
                endDate: new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0),
            };
        });

        const whereConditions = await this.getZoneAndAgentConditions(zona, agente);
        if (agente) {
            whereConditions['HistorialEntregas'] = {
                some: { agenteId: agente },
            };
        }

        const counts = await Promise.all(lastSixMonths.map(({ startDate, endDate }) =>
            this.modelClient.count({
                where: { fecha_de_salida: { gte: startDate, lt: endDate }, ...whereConditions },
            })
        ));

        return lastSixMonths.map((monthData, index) => ({
            month: monthData.month,
            year: monthData.year,
            count: counts[index],
        }));
    }

    async getInstrumentosAEntregarPorZonas(zoneName: string): Promise<InstrumentoExtendido[]> {
        return this.modelClient.findMany({
            where: {
                estado: EstadoInstrumento.PENDIENTE_DE_NOTIFICAR,
                zoneName,
            },
            select: selectOptions,
        });
    }

    async getInstrumentosByAgent(agentId: number, searchParams: SearchParamsInstrumentos): Promise<InstrumentoExtendido[]> {
        const where = this.buildWhereClause(searchParams);

        // Get the agent's zones
        const agentZones = await prisma.agente.findUnique({
            where: { id: agentId },
            select: { zonas: { select: { zoneName: true } } },
        });

        // Filter by either histogram entries matching the agent OR by the agent's zones
        where['OR'] = [
            { HistorialEntregas: { some: { agenteId: agentId } } },
            agentZones?.zonas?.length ? { zoneName: { in: agentZones.zonas.map(z => z.zoneName) } } : {}
        ];

        return this.modelClient.findMany({
            where,
            select: selectOptions,
        });
    }
}