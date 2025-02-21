import prisma from "@/lib/db";
import BaseRepository from "./BaseRepository";
import {  Zone } from "@prisma/client";
import { CustomFeature, Position } from "@/types/MapTypes";
import { ExtendedZone, ZoneDto } from "@/types/ZoneTypes";
import { createSubZones } from "@/lib/locationUtils/subZoneUtils";

export default class ZoneRepository extends BaseRepository<Zone> {
    constructor() {
        super(prisma.zone);
    }

    async getAll() {
        return this.modelClient.findMany({
            select: {
                id: true,
                zoneName: true,
                zoneColor: true,
                geometry: {
                    select: {
                        coordinates: {
                            select: {
                                latitude: true,
                                longitude: true
                            }
                        }
                    }
                }
            }
        });
    }

    async getAllWithAgents():Promise<ZoneDto[]> {
        return this.modelClient.findMany({
            select: {
                id: true,
                zoneName: true,
                zoneColor: true,
                Agentes: {
                    select: {
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                },

            }
        });
    }

    async addNewAgenteToZone(zoneId: string, agenteId: number): Promise<{ success: boolean; message: string }> {
        try {
            const zone = await this.modelClient.findUnique({
                where: { id: zoneId },
                select: { id: true }
            });

            if (!zone) throw new Error("Zone not found");

            await prisma.zone.update({
                where: { id: zoneId },
                data: {
                    Agentes: {
                        connect: { id: agenteId }
                    }
                }
            });

            return { success: true, message: "Agente added to zone successfully" };
        } catch (error) {
            console.error("Error adding agente to zone:", error);
            return { success: false, message: error instanceof Error ? error.message : "An unknown error occurred" };
        }
    }

    async removeAgenteFromZone(zoneId: string, agenteId: number): Promise<{ success: boolean; message: string }> {
        try {
            const zone = await this.modelClient.findUnique({
                where: { id: zoneId },
                select: { id: true }
            });

            if (!zone) throw new Error("Zone not found");

            await prisma.zone.update({
                where: { id: zoneId },
                data: {
                    Agentes: {
                        disconnect: { id: agenteId }
                    }
                }
            });

            return { success: true, message: "Agente removed from zone successfully" };
        } catch (error) {
            console.error("Error removing agente from zone:", error);
            return { success: false, message: error instanceof Error ? error.message : "An unknown error occurred" };
        }
    }

    async create(zone: CustomFeature) {
        const subzones = await createSubZones(zone);
        return this.modelClient.create({
            data: {
                id: zone.id,
                zoneName: zone.properties.name,
                zoneColor: zone.properties.color,
                type: zone.type,
                geometry: {
                    create: {
                        type: zone.geometry.type,
                        coordinates: {
                            create: (zone.geometry.coordinates as Position[][])[0].map(([lat, lon]) => ({
                                latitude: lat,
                                longitude: lon
                            }))
                        }
                    }
                },
                SubZonas: {
                    create: subzones.map(subzone => ({
                        zoneName: subzone.name,
                        type: subzone.polygon?.type ?? "Polygon",
                        geometry: {
                            create: {
                                type: subzone.polygon?.geometry.type ?? "Polygon",
                                coordinates: {
                                    create: (subzone.polygon?.geometry.coordinates as Position[][])[0].map(([lat, lon]) => ({
                                        latitude: lat,
                                        longitude: lon
                                    }))
                                }
                            }
                        },
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }))
                },
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
    }

    async updateZone(id: string, data: CustomFeature): Promise<{ success: boolean; message: string; updatedZone?: any }> {
        try {
            const updatedZone = await prisma.$transaction(async (trx) => {
                const zoneToUpdate = await trx.zone.findUnique({
                    where: { id },
                    select: { geometryId: true }
                });

                if (!zoneToUpdate) throw new Error("Zone not found");

                await trx.coordinates.deleteMany({
                    where: { geometryAssociatedId: zoneToUpdate.geometryId }
                });

                const newCoordinates = (data.geometry.coordinates as Position[][])[0].map(([lat, lon]) => ({
                    latitude: lat,
                    longitude: lon
                }));

                const subZones = await createSubZones(data);

                return trx.zone.update({
                    where: { id },
                    data: {
                        zoneName: data.properties.name,
                        zoneColor: data.properties.color,
                        type: data.type,
                        geometry: {
                            update: {
                                coordinates: { create: newCoordinates }
                            }
                        },
                        SubZonas: {
                            deleteMany: {},
                            create: subZones.map(subzone => ({
                                zoneName: subzone.name,
                                type: subzone.polygon?.type ?? "Polygon",
                                geometry: {
                                    create: {
                                        type: subzone.polygon?.geometry.type ?? "Polygon",
                                        coordinates: {
                                            create: (subzone.polygon?.geometry.coordinates as Position[][])[0].map(([lat, lon]) => ({
                                                latitude: lat,
                                                longitude: lon
                                            }))
                                        }
                                    }
                                },
                                createdAt: new Date(),
                                updatedAt: new Date()
                            }))
                        },
                        updatedAt: new Date()
                    }
                });
            });

            return { success: true, message: "Zone updated successfully", updatedZone };
        } catch (error) {
            console.error("Error updating zone:", error);
            return { success: false, message: error instanceof Error ? error.message : "An unknown error occurred" };
        }
    }

    async deleteZone(zoneId: string): Promise<{ success: boolean; message: string }> {
        try {
            await prisma.$transaction(async (trx) => {
                const zoneToDelete = await trx.zone.findUnique({
                    where: { id: zoneId },
                    select: { geometryId: true }
                });

                if (!zoneToDelete) throw new Error("Zone not found");

                await Promise.all([
                    trx.coordinates.deleteMany({
                        where: { geometryAssociatedId: zoneToDelete.geometryId }
                    }),
                    trx.zone.delete({ where: { id: zoneId } })
                ]);
            });

            return { success: true, message: "Zone deleted successfully" };
        } catch (error) {
            console.error("Error deleting zone:", error);
            return { success: false, message: error instanceof Error ? error.message : "An unknown error occurred" };
        }
    }

    async getTotalZones(): Promise<number> {
        return await prisma.zone.count();
    }

    async getZoneById(id: string): Promise<ExtendedZone> {
        return this.modelClient.findUnique({
            where: { id },
            select: {
                id: true,
                zoneName: true,
                zoneColor: true,
                geometry: {
                    select: {
                        coordinates: {
                            select: {
                                latitude: true,
                                longitude: true
                            }
                        }
                    }
                },
                SubZonas: {
                    select: {
                        id: true,
                        zoneName: true,
                        geometry: {
                            select: {
                                coordinates: {
                                    select: {
                                        latitude: true,
                                        longitude: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }

}
