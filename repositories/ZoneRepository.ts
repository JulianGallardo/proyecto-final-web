import prisma from "@/lib/db";
import BaseRepository from "./BaseRepository";
import { Zone } from "@prisma/client";
import { CustomFeature, ExtendedZone, Position } from "@/types/MapTypes";

export default class ZoneRepository extends BaseRepository<Zone> {
    constructor() {
        super(prisma.zone);
    }


    async getAll() {
        const zones = this.modelClient.findMany({
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

        return zones;
    }




    async create(zone: CustomFeature) {
        const newZone:Promise<Zone> = this.modelClient.create({
            data: {
                id: zone.id,
                zoneName: zone.properties.name,
                zoneColor: zone.properties.color,
                type: zone.type,
                geometry: {
                    create: {
                        type: zone.geometry.type,
                        coordinates: {
                            create: (zone.geometry.coordinates as Position[][])[0].map((coord) => {
                                const newCoord = [coord[0], coord[1]];

                                return {
                                    latitude: newCoord[0],
                                    longitude: newCoord[1]
                                };
                            })
                        }
                    }
                },

                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        return newZone;
    }


    async updateZone(id: string, data: CustomFeature) {

        prisma.$transaction(async (trx) => {
            try {
                const zoneToUpdate = await trx.zone.findUnique({
                    where: { id: id },
                    select: {
                        geometryId: true,
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
                }).then((zone) => {
                    if (!zone) {
                        throw new Error("Zone not found");
                    }
                    return zone as ExtendedZone;
                }).catch((e) => {
                    throw new Error(e);
                });


                await trx.coordinates.deleteMany({
                    where: {
                        geometryAssociatedId: zoneToUpdate.geometryId
                    }
                });

                console.log("Coordenadas viejas eliminadas");

                const updated = await trx.zone.update({
                    where: { id: id },
                    data: {
                        zoneName: data.properties.name,
                        zoneColor: data.properties.color,
                        type: data.type,
                        geometry: {
                            update: {
                                where: {
                                    id: zoneToUpdate.geometryId
                                }, // Identifica la geometría a actualizar
                                data: {
                                    coordinates: {
                                        create: (data.geometry.coordinates as Position[][])[0].map((coord) => {
                                            return {
                                                latitude: coord[0],
                                                longitude: coord[1],
                                            };
                                        }),
                                    },
                                },
                            },
                        },
                        updatedAt: new Date(),
                    },
                });

                return updated;
            } catch (e) {
                console.log(e);
                throw new Error("No fue posible actualizar la zona");

            }
        }
        );
    }


    async deleteZone(zoneId: string) {

        prisma.$transaction(async (trx) => {
            const zoneToDelete = await trx.zone.findUnique({
                where: { id: zoneId },
                select: {
                    geometryId: true
                }
            }).then((zone) => {
                if (!zone) {
                    throw new Error("Zone not found");
                }
                return zone;
            }).catch((e) => {
                throw new Error(e);
            });

            await trx.coordinates.deleteMany({
                where: {
                    geometryAssociatedId: zoneToDelete.geometryId
                }
            });

            const deleted = await trx.zone.delete({
                where: { id: zoneId }
            });

            return deleted;
        });
    }
}
