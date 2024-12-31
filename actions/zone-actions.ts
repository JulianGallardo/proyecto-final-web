"use server";
import ZoneRepository from "@/repositories/ZoneRepository";
import { CustomFeature } from "@/types/MapTypes";
import { Zone } from "@prisma/client";

const zoneRepo = new ZoneRepository();

export async function createNewZone(params:CustomFeature) {
    return zoneRepo.create(params);
}