import prisma from "@/lib/db";
import BaseRepository from "./BaseRepository";
import { EstadoInstrumento, Instrumento, TipoCarga } from "@prisma/client";
import { InstrumentoDTO, InstrumentoExtendido } from "@/types/instrumentoTypes";
import SearchParamsInstrumentos from "@/types/searchParams";
import OrdenRepository from "./OrdenRepository";
import { getCoordinates, getZoneInCoords } from "@/lib/locationUtils/zoneUtils";


const selectOptions = {
    codigoInstrumento: true,
    cargaInstrumento: true,
    fecha_de_ingreso: true,
    fecha_de_salida: true,
    caratula: true,
    destinatario: true,
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
                }
            }
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

};



export default class InstrumentosRepository extends BaseRepository<Instrumento> {
    ordenRepository: OrdenRepository;
    constructor(
        ordenRepository: OrdenRepository
    ) {
        super(prisma.instrumento);
        this.ordenRepository = ordenRepository;
    }


    itemsPerPage = 10;


    filters(searchParams: SearchParamsInstrumentos) {

        const parseString = (value: string) => value.replace(/\+/g, " ");

        const endOfDate = (dateQuery: string) => {
            const [year, month, day] = dateQuery.split("-").map(Number);

            return new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999)); // Fin del día
        }

        const parseCode = (value: string) => {



            const parsedValue = value.replace(/\+/g, "");
            const code = parsedValue.split("-");
            if (code.length !== 2) {
                if (code[0] === "PDF" || code[0] === "MAN") {
                    return {
                        type: code[0],
                        number: undefined
                    }
                }
                else {
                    return {
                        type: undefined,
                        number: code[0]
                    }
                }


            }

            return {
                type: code[0],
                number: code[1]
            }
        }




        // Mapeo de las claves de `searchParams` a sus correspondientes condiciones
        const filterMapping: { [key: string]: (value: any) => any } = {
            desde: (value) => ({ fecha_de_ingreso: { gte: new Date(value) } }),
            hasta: (value) => ({ fecha_de_ingreso: { lte: endOfDate(value) } }),
            exitDate: (value) => (
                parseString(value) === "No registrada" ? { fecha_de_salida: { equals: null } } : { fecha_de_salida: { lte: new Date(value) } }
            ),
            caratula: (value) => ({ caratula: { startsWith: parseString(value), mode: "insensitive" } }),
            codigo: (value) => {
                const parsedCode = parseCode(value);
                return {
                    codigoInstrumento: { startsWith: parsedCode.number, mode: "insensitive" },
                    cargaInstrumento: { equals: parsedCode.type }
                };
            },
            address: (value) => ({ domicilio_denunciado: { startsWith: parseString(value), mode: "insensitive" } }),
            ordenNumber: (value) => ({ orden: { ordenNumber: { equals: Number(value) } } }),
            juzgado: (value) => ({ orden: { juzgado: { identifier: { startsWith: parseString(value), mode: "insensitive" } } } }),
            instrumentType: (value) => ({ instrumentoType: { name: { equals: parseString(value), mode: "insensitive" } } }),
        };

        // Construir dinámicamente el objeto "where"
        const where: any = {
            AND: Object.entries(searchParams)
                .map(([key, value]) => {
                    const filterBuilder = filterMapping[key];
                    return filterBuilder ? filterBuilder(value) : null; // Construye la condición si existe en el mapeo
                })
                .filter((condition) => condition !== null), // Elimina las condiciones nulas
        };

        where.AND.push({ deleted: false }); // Añadir condición para mostrar solo los registros no eliminados


        if (where.AND.length === 0) {
            delete where.AND;
        }


        return where;
    }


    async getInstrumentosByZone(zoneName: string): Promise<InstrumentoExtendido[]> {
        return this.modelClient.findMany({
            where: {
                Zona: {
                    zoneName: zoneName
                }
            },
            select: selectOptions,
        });
    }


    async getInstrumentoByCode(code: string, tipoDeCarga: TipoCarga) {
        return this.modelClient.findFirst(
            {
                where: {
                    codigoInstrumento: code,
                    cargaInstrumento: tipoDeCarga
                }
            }
        );
    }

    async getInstrumentoByCaratula(caratula: string): Promise<InstrumentoExtendido | null> {
        return this.modelClient.findFirst({
            where: {
                caratula: {
                    equals: caratula,
                    mode: "insensitive",
                }
            },
            select: selectOptions,
        });
    }

    async getInstrumento(juzgadoIdentifier: string, caratula: string, destinatario: string): Promise<InstrumentoExtendido | null> {
        return this.modelClient.findFirst({
            where: {
                caratula: {
                    startsWith: caratula,
                    mode: "insensitive",
                },
                destinatario: {
                    startsWith: destinatario,
                    mode: "insensitive",
                },
                orden: {
                    juzgado: {
                        identifier: juzgadoIdentifier,
                    },
                },
            },
            select: selectOptions,
        });
    }


    async getTotalPagesInstrumentosPaginated(searchParams: SearchParamsInstrumentos) {


        const where = this.filters(searchParams);

        const instrumentosCountPromise = await this.modelClient.count({
            where,
        });

        const [instrumentosCount] = await Promise.all([instrumentosCountPromise]);

        const totalPages = Math.ceil(instrumentosCount / this.itemsPerPage);

        return totalPages;
    }

    async getInstrumentosPaginated(searchParams: SearchParamsInstrumentos, page: number) {
        const where = this.filters(searchParams);

        // Realizar la consulta con Prisma
        const instrumentos = await this.modelClient.findMany({
            where,
            skip: (page - 1) * this.itemsPerPage,
            take: this.itemsPerPage,
            select: selectOptions,
            orderBy: [
                {
                    fecha_de_salida: {
                        sort: "asc",
                        nulls: "first",
                    }
                },
                {
                    fecha_de_ingreso: "asc"
                }
            ],
        });

        console.log(instrumentos);

        return instrumentos;
    }




    async getInstrumentos(): Promise<InstrumentoExtendido[]> {
        return this.modelClient.findMany({
            select: selectOptions,
            orderBy: [
                {
                    fecha_de_salida: {
                        sort: "asc",
                        nulls: "first", // Primero los valores nulos
                    }
                },
                {
                    fecha_de_ingreso: "asc"
                }
            ],
        });
    }

    async calculateManualCode(): Promise<number> {
        const maxCodigo = await this.modelClient.aggregate({
            _max: {
                codigoInstrumento: true, // Busca el mayor código de instrumento
            },
            where: {
                cargaInstrumento: TipoCarga.MAN
            },
        });

        // Extraer el número del código, asumir formato numérico y sumar 1
        const lastCode = maxCodigo._max.codigoInstrumento
            ? parseInt(maxCodigo._max.codigoInstrumento, 10)
            : 0;

        return lastCode + 1;
    }





    async createInstrumento(data: InstrumentoDTO): Promise<InstrumentoExtendido> {
        const orden = await this.ordenRepository.createOrden(data.juzgadoIdentifier);
        if (!orden) throw new Error("No se pudo crear la orden");

        if (data.tipoDeCarga === TipoCarga.MAN) {
            data.codigo = (await this.calculateManualCode()).toString();
        }

        const { punto, nuevaZona } = await this.getNewZoneAndCoordinates(data);




        try {
            const instrumento = await this.modelClient.create({
                data: {
                    codigoInstrumento: data.codigo,
                    cargaInstrumento: data.tipoDeCarga,
                    fecha_de_ingreso: data.fecha_de_ingreso,
                    fecha_de_salida: data.fecha_de_salida || undefined,
                    caratula: data.caratula,
                    destinatario: data.destinatario,
                    domicilio_denunciado: data.domicilio_denunciado,
                    orden: { connect: { id: orden.id } },
                    instrumentoType: { connect: { identifier: data.instrumentoTypeIdentifier } },
                    latitude: punto ? punto[1] : undefined,
                    longitude: punto ? punto[0] : undefined,
                    observaciones: data.observaciones,

                    Zona: nuevaZona ? { connect: { zoneName: nuevaZona.zoneName } } : undefined,
                },
                select: selectOptions
            });

            return instrumento;
        } catch (error) {
            console.warn(error);
            throw new Error("No se pudo crear el instrumento");
        }
    }


    async updateInstrumento(
        juzgadoIdentifier: string,
        ordenNumber: number,
        data: Partial<InstrumentoDTO>
    ): Promise<InstrumentoExtendido | null> {
        let newOrden = null;

        const juzgado = await prisma.juzgado.findUnique({
            where: { identifier: juzgadoIdentifier }
        });
        if (!juzgado) throw new Error("No se encontró el juzgado");

        const ordenActual = await this.ordenRepository.getOrden(ordenNumber, juzgado.identifier);
        if (data.juzgadoIdentifier && juzgado.identifier !== data.juzgadoIdentifier) {
            newOrden = await this.ordenRepository.createOrden(data.juzgadoIdentifier);
        } else {
            newOrden = ordenActual;
        }

        const { punto, nuevaZona } = await this.getNewZoneAndCoordinates(data);



        const update = await this.modelClient.update({
            where: { ordenId: ordenActual?.id },
            data: {
                fecha_de_ingreso: data.fecha_de_ingreso,
                fecha_de_salida: data.fecha_de_salida || undefined,
                caratula: data.caratula,
                destinatario: data.destinatario,
                domicilio_denunciado: data.domicilio_denunciado,
                orden: { connect: { id: newOrden?.id } },
                Zona: nuevaZona ? { connect: { zoneName: nuevaZona.zoneName } } : undefined,
                instrumentoType: { connect: { identifier: data.instrumentoTypeIdentifier } },
                latitude: punto ? punto[1] : undefined,
                longitude: punto ? punto[0] : undefined,
                observaciones: data.observaciones
            },
            select: selectOptions
        });

        return update;
    }

    private async getNewZoneAndCoordinates(data: Partial<InstrumentoDTO>) {
        let punto = null;

        if (data.domicilio_denunciado && data.domicilio_denunciado !== "") {
            punto = await getCoordinates(data.domicilio_denunciado);
        }

        let nuevaZona = undefined;
        if (punto) {
            nuevaZona = await getZoneInCoords(punto[0], punto[1]);
        }
        return { punto, nuevaZona };
    }

    async deleteInstrumento(juzgadoIdentifier: string, ordenNumber: number): Promise<Instrumento | null> {
        const ordenActual = await this.ordenRepository.getOrden(ordenNumber, juzgadoIdentifier);

        return this.modelClient.update({
            where: {
                ordenId: ordenActual?.id,
            },
            data: {
                deletedAt: new Date(),
                deleted: true,
            },
        });
    }

    async createInstrumentos(instrumentos: InstrumentoDTO[]) {
        const instrumentosCreados: InstrumentoExtendido[] = [];

        for (const instrumento of instrumentos) {
            const result = await this.createInstrumento(instrumento);
            instrumentosCreados.push(result);
        }

        return instrumentosCreados;
    }

    async getTotalInstrumentos(zona?: string, agente?: number): Promise<{ total: number; growthPercentage: number }> {
        const currentDate = new Date();
        const firstDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const firstDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);

        // Filtros condicionales
        const whereConditions: Record<string, any> = { deleted: false };
        if (zona) whereConditions['zoneName'] = zona; // Filter by zone

        // Now use the `some` filter to check if any related `HistorialEntregas` entry
        // has the `agenteId` that you are looking for.
        if (agente) {
            whereConditions['HistorialEntregas'] = {
                some: {
                    agenteId: agente, // Filter by agent ID in the related `HistorialEntregas` table
                },
            };
        }
        // Contar instrumentos totales
        const totalInstrumentos = await this.modelClient.count({ where: whereConditions });

        // Contar instrumentos creados en el mes actual y en el mes anterior
        const currentMonthCount = await this.modelClient.count({
            where: {
                fecha_de_ingreso: { gte: firstDayOfCurrentMonth },
                ...whereConditions,
            },
        });

        const previousMonthCount = await this.modelClient.count({
            where: {
                fecha_de_ingreso: { gte: firstDayOfPreviousMonth, lt: firstDayOfCurrentMonth },
                ...whereConditions,
            },
        });

        // Calcular crecimiento porcentual
        const growthPercentage = previousMonthCount > 0
            ? ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100
            : currentMonthCount > 0 ? 100 : 0;

        return { total: totalInstrumentos, growthPercentage };
    }


    async getInstrumentosActivos(zona?: string, agente?: number): Promise<{ totalActivos: number; growthPercentage: number }> {
        const currentDate = new Date();
        const firstDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const firstDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);

        // Filtros condicionales
        const whereConditions: Record<string, any> = { fecha_de_salida: null, deleted: false };
        if (zona) whereConditions['zoneName'] = zona; // Filtrar por zona
        // Now use the `some` filter to check if any related `HistorialEntregas` entry
        // has the `agenteId` that you are looking for.
        if (agente) {
            whereConditions['HistorialEntregas'] = {
                some: {
                    agenteId: agente, // Filter by agent ID in the related `HistorialEntregas` table
                },
            };
        }
        // Instrumentos activos
        const totalActivos = await this.modelClient.count({ where: whereConditions });

        const currentMonthActivos = await this.modelClient.count({
            where: {
                fecha_de_ingreso: { gte: firstDayOfCurrentMonth },
                fecha_de_salida: null,
                ...whereConditions,
            },
        });

        const previousMonthActivos = await this.modelClient.count({
            where: {
                fecha_de_ingreso: { gte: firstDayOfPreviousMonth, lt: firstDayOfCurrentMonth },
                fecha_de_salida: null,
                ...whereConditions,
            },
        });

        const growthPercentage = previousMonthActivos > 0
            ? ((currentMonthActivos - previousMonthActivos) / previousMonthActivos) * 100
            : currentMonthActivos > 0 ? 100 : 0;

        return { totalActivos, growthPercentage };
    }



    async getInstrumentosPorEstado(zona?: string, agente?: number) {
        const estados = EstadoInstrumento;

        // Filtros condicionales
        const whereConditions: Record<string, any> = { deleted: false };
        if (zona) whereConditions['zoneName'] = zona; // Filtrar por zona
        // Now use the `some` filter to check if any related `HistorialEntregas` entry
        // has the `agenteId` that you are looking for.
        if (agente) {
            whereConditions['HistorialEntregas'] = {
                some: {
                    agenteId: agente, // Filter by agent ID in the related `HistorialEntregas` table
                },
            };
        }
        const counts = await Promise.all(Object.values(estados).map(async (estado) => {
            const count = await this.modelClient.count({
                where: {
                    estado: estado,
                    ...whereConditions,
                },
            });
            return { estado, count };
        }));

        return counts.reduce((acc: Record<EstadoInstrumento, number>, { estado, count }) => {
            acc[estado] = count;
            return acc;
        }, {} as Record<EstadoInstrumento, number>);
    }



    async getInstrumentosEntregadosUltimosSeisMeses(zona?: string, agente?: number) {
        const currentDate = new Date();

        // Definir el arreglo de los meses
        const months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];

        // Generar un arreglo con los meses de los últimos 6 meses
        const lastSixMonths = [];
        for (let i = 0; i < 6; i++) {
            const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            lastSixMonths.push({
                month: months[monthDate.getMonth()],
                year: monthDate.getFullYear(),
                startDate: new Date(monthDate.getFullYear(), monthDate.getMonth(), 1),
                endDate: new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0), // Último día del mes
            });
        }

        // Filtros condicionales
        const whereConditions: Record<string, any> = { deleted: false };
        if (zona) whereConditions['zoneName'] = zona; // Filtrar por zona
        // Now use the `some` filter to check if any related `HistorialEntregas` entry
        // has the `agenteId` that you are looking for.
        if (agente) {
            whereConditions['HistorialEntregas'] = {
                some: {
                    agenteId: agente, // Filter by agent ID in the related `HistorialEntregas` table
                },
            };
        }
        // Obtener las entregas por cada mes
        const deliveriesByMonth = [];
        for (const monthData of lastSixMonths) {
            const count: number = await this.modelClient.count({
                where: {
                    fecha_de_salida: { gte: monthData.startDate, lt: monthData.endDate },
                    ...whereConditions,
                },
            });

            deliveriesByMonth.push({
                month: monthData.month,
                year: monthData.year,
                count,
            });
        }

        return deliveriesByMonth;
    }


    async getInstrumentosAEntregarPorZonas(zoneName:string) {
        return this.modelClient.findMany({
            where: {
                estado: EstadoInstrumento.PENDIENTE_DE_ENTREGA,
                Zona: {
                    zoneName: zoneName
                }
            },
            select: selectOptions,
        });
    }






}
