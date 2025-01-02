"use server";
import ZoneRepository from "@/repositories/ZoneRepository";
import { CustomFeature } from "@/types/MapTypes";
import { Zone } from "@prisma/client";
import { HexColor } from "terra-draw";

interface ZoneResponse extends Zone {
    geometry: {
        type: string;
        coordinates: {
            latitude: number;
            longitude: number;
        }[];
    };
}

const zoneRepo = new ZoneRepository();


export async function createNewZone(params:CustomFeature) {
    return zoneRepo.create(params);
}

export async function getAllZones() {
    const zonesBdd:ZoneResponse[] = await zoneRepo.getAll();
    


    if (!zonesBdd) {
        return [];
    }

    
    const zones = zonesBdd.map((zone) => {
        return {
            id: zone.id,
            zoneName: zone.zoneName,
            zoneColor: zone.zoneColor as HexColor,
            geometry: {
                type: zone.geometry.type,
                coordinates: zone.geometry.coordinates.map((coord) => {
                    return [coord.latitude, coord.longitude];
                })
            }
        };
    });

    return zones;




}