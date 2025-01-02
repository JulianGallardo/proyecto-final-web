import prisma from "@/lib/db";
import BaseRepository from "./BaseRepository";
import { Zone } from "@prisma/client";
import { CustomFeature, Position } from "@/types/MapTypes";

export default class ZoneRepository extends BaseRepository<Zone> {
    constructor() {
        super(prisma.zone);
    }


    getAll() {
        const zones =this.modelClient.findMany({
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




    create(zone: CustomFeature) {
        const newZone = this.modelClient.create({
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

    
    updateZone(id: string, data: CustomFeature) {

        const zoneToUpdate = this.modelClient.findUnique({
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
        });

        if (!zoneToUpdate) {
            throw new Error("Zone not found");
        }

        const updated =  this.modelClient.update({
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
                                deleteMany: {}, // Elimina las coordenadas existentes
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
    }
    

    async deleteZone(zoneId: string) {
        const deleted = await this.modelClient.delete({
            where: { id: zoneId }
        });

        return deleted;
    }
}
