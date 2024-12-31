import prisma from "@/lib/db";
import BaseRepository from "./BaseRepository";
import {  Zone } from "@prisma/client";
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
                                }
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


    
}