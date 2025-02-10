"use server";
import prisma from "@/lib/db";
import ZoneRepository from "@/repositories/ZoneRepository";
import { CustomFeature, Position } from "@/types/MapTypes";
import { ZoneDto } from "@/types/ZoneTypes";
import { Zone } from "@prisma/client";
import { revalidatePath } from "next/cache";
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


export async function createNewZone(params: CustomFeature): Promise<Zone> {
    return zoneRepo.create(params);
}


export async function createNewZones(params: CustomFeature[]): Promise<Record<string, string>> {
    try {
        const result = await prisma.$transaction(async (tsx) => {
            const zonesInDb: Zone[] = await zoneRepo.getAll();

            // Eliminar zonas que no están en los parámetros en paralelo
            await Promise.all(zonesInDb.map(async (zone) => {
                if (!params.find((z) => z.id === zone.id)) {
                    await zoneRepo.deleteZone(zone.id);
                }
            }));

            // Crear o actualizar zonas según sea necesario en paralelo
            await Promise.all(params.map(async (zone) => {
                const existingZone = zonesInDb.find((z) => z.id === zone.id);
                if (!existingZone) {
                    await zoneRepo.create(zone);
                } else if (typeof zone.id === "string") {
                    await zoneRepo.updateZone(zone.id, zone);
                }
            }));

            return { status: "success" };
        });

        console.log("Transaction completed successfully.");
        return result;
    } catch (error) {
        console.error("Error in createNewZones:", error);
        return { status: "error", message: error instanceof Error ? error.message : "Unknown error occurred" };
    }
}

export async function getAllZones(): Promise<CustomFeature[]> {
    const zonesBdd: ZoneResponse[] = await zoneRepo.getAll();

    if (!zonesBdd) {
        return [];
    }


    const zones: CustomFeature[] = zonesBdd.map((zone) => {

        const coordinates: Position[] = zone.geometry.coordinates.map((coord) => {
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

export async function getAllZonesWithAgents(): Promise<ZoneDto[]> {
    return zoneRepo.getAllWithAgents();
}

export async function updateZonesAgents(zonesIdToAddAgent:string[],zonesIdToDeleteAgent:string[],agenteId:number): Promise<{ success: boolean; message: string }> {
    try {
        await prisma.$transaction(async (tsx) => {
            await Promise.all(zonesIdToAddAgent.map(async (zoneId) => {
                await zoneRepo.addNewAgenteToZone(zoneId, agenteId);
            }));
            await Promise.all(zonesIdToDeleteAgent.map(async (zoneId) => {
                await zoneRepo.removeAgenteFromZone(zoneId, agenteId);
            }));
        });
        revalidatePath("/agentes/:id");
        revalidatePath("/agentes/zonas");
        return { success: true, message: "Agentes actualizados correctamente" };
    } catch (error) {
        console.error("Error updating zones agents:", error);
        return { success: false, message: error instanceof Error ? error.message : "An unknown error occurred" };
    }
}