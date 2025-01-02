"use server";
import ZoneRepository from "@/repositories/ZoneRepository";
import { CustomFeature, Position } from "@/types/MapTypes";
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

export async function getAllZones(): Promise<CustomFeature[]> {
    const zonesBdd:ZoneResponse[] = await zoneRepo.getAll();
    


    if (!zonesBdd) {
        return [];
    }


    const zones:CustomFeature[] = zonesBdd.map((zone) => {

        const coordinates:Position[] = zone.geometry.coordinates.map((coord) => {
            return [coord.latitude, coord.longitude];
        });

        return {
            id: zone.id,
            type: "Feature",
            properties: {
                type: zone.type,
                name: zone.zoneName,
                color: zone.zoneColor as HexColor
            },
            geometry: {
                type: "Polygon",
                coordinates: [coordinates]
            }
        };
    });

    return zones;




}