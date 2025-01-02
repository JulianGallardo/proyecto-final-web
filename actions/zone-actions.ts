"use server";
import ZoneRepository from "@/repositories/ZoneRepository";
import { CustomFeature, Position } from "@/types/MapTypes";
import { Zone } from "@prisma/client";
import { error } from "console";
import { typeOf } from "maplibre-gl";
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


export async function createNewZone(params:CustomFeature): Promise<Zone> {
    return zoneRepo.create(params);
}


export async function createNewZones(params:CustomFeature[]): Promise<Record<string, string>> {
    const zonesInDb:Zone[] = await zoneRepo.getAll();


    try{
        zonesInDb.forEach(async (zone) => {
            if (!params.find((z) => z.id === zone.id)) {
                await zoneRepo.deleteZone(zone.id);
            }
        });
    
        params.map(async (zone) => {
            if (!zonesInDb.find((z) => z.id === zone.id)) {
                await zoneRepo.create(zone);
            }
            else if (zonesInDb.find((z) => z.id === zone.id) && typeof zone.id === "string") {
                console.log("updating zone");
                await zoneRepo.updateZone(zone.id, zone);
            }
        });
    }catch(e){
        return {
            status: "error"
        }
    }
    

    return {
        status: "success"
    }

    
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