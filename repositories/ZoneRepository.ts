import prisma from "@/lib/db";
import BaseRepository from "./BaseRepository";
import { Zone } from "@prisma/client";
import { CustomFeature, Position } from "@/types/MapTypes";

export default class ZoneRepository extends BaseRepository<Zone> {
    constructor() {
        super(prisma.user);
    }

    async create(zone: CustomFeature) {
        const newZone = await prisma.zone.create({
            data: {
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

    async updateZone(zoneId: string, updatedZone: CustomFeature) {

        const zoneToUpdate = await prisma.zone.findUnique({
            where: { id: zoneId },
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
        });

        if (!zoneToUpdate) {
            throw new Error("Zone not found");
        }

        const updated = await prisma.zone.update({
            where: { id: zoneId },
            data: {
                zoneName: updatedZone.properties.name,
                zoneColor: updatedZone.properties.color,
                type: updatedZone.type,
                geometry: {
                    update: {
                        where: {
                            id: zoneToUpdate.geometryId
                        }, // Identifica la geometría a actualizar
                        data: {
                            coordinates: {
                                deleteMany: {}, // Elimina las coordenadas existentes
                                create: (updatedZone.geometry.coordinates as Position[][])[0].map((coord) => {
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
    }
    

    async deleteZone(zoneId: string) {
        const deleted = await prisma.zone.delete({
            where: { id: zoneId }
        });

        return deleted;
    }
}
