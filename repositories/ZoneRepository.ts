import prisma from "@/lib/db";
import BaseRepository from "./BaseRepository";
import { Zone, SubZone, Prisma } from "@prisma/client";
import { CustomFeature, Position } from "@/types/MapTypes";
import { ExtendedZone, ZoneDtoWithSubZones } from "@/types/ZoneTypes";
import { createSubZones } from "@/lib/locationUtils/subZoneUtils";


export default class ZoneRepository extends BaseRepository<Zone> {
    constructor() {
        super(prisma.zone);
    }

    _select = {
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
    };

    async getAll() {
        return this.modelClient.findMany({
            select: this._select
        });
    }

    async getAllWithAgents(): Promise<ZoneDtoWithSubZones[]> {
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
                    trx.subZone.deleteMany({
                        where: { zonaId: zoneId }
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

    async createSubZones(zoneId: string, subZones: CustomFeature[]): Promise<{ success: boolean; message: string }> {
        try {
            await prisma.$transaction(async (trx) => {
                const zone = await trx.zone.findUnique({
                    where: { id: zoneId },
                    select: { id: true }
                });
    
                if (!zone) throw new Error("Zone not found");
    
                // Delete existing subzones
                await trx.subZone.deleteMany({
                    where: { zonaId: zoneId }
                });
    
                // Create subzones one by one to handle the nested relationship
                for (const subzone of subZones) {
                    // First create the geometry
                    const geometry = await trx.geometry.create({
                        data: {
                            type: subzone.geometry.type,
                            coordinates: {
                                create: (subzone.geometry.coordinates as Position[][])[0].map(([lat, lon]) => ({
                                    latitude: lat,
                                    longitude: lon
                                }))
                            }
                        }
                    });
    
                    // Then create the subzone with the geometry ID
                    await trx.subZone.create({
                        data: {
                            id: typeof subzone.id === 'number' ? String(subzone.id) : subzone.id,
                            zonaId: zoneId,
                            zoneName: subzone.properties.name,
                            type: subzone.type,
                            geometryId: geometry.id, // Use the created geometry's ID
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }
                    });
                }
            });
    
            return { success: true, message: "Subzones updated successfully" };
        } catch (error) {
            console.error("Error updating subzones:", error);
            return { success: false, message: error instanceof Error ? error.message : "An unknown error occurred" };
        }
    }

    async getTotalZones(): Promise<number> {
        return await prisma.zone.count();
    }

    async getZoneById(id: string): Promise<ExtendedZone> {
        return this.modelClient.findUnique({
            where: { id },
            select: this._select
        });
    }

    async getZonesByAgent(agentId: number): Promise<ExtendedZone[]> {
        return this.modelClient.findMany({
            where: {
                Agentes: {
                    some: {
                        id: agentId
                    }
                }
            },
            select: this._select
        });
    }



}
