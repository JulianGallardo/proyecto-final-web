"use server";
import ZoneRepository from "@/repositories/ZoneRepository";
import { ExtendedZone } from "@/types/ZoneTypes";
import { point, polygon, booleanPointInPolygon } from "@turf/turf";
import { RouteService } from "./routeService";

const zoneRepo = new ZoneRepository();
const routeService = new RouteService();

async function getZoneInCoords(lat: number, long: number) {
    const zones: ExtendedZone[] = await zoneRepo.getAll(); // Obtener todas las zonas

    const pointToCheck = point([long, lat]); // Crear un punto con Turf.js

    const zone = zones.find((zone: ExtendedZone) => {
        const polygonCoords = zone.geometry.coordinates.map(coord => [coord.longitude, coord.latitude]); // Convertir coordenadas

        const turfPolygon = polygon([polygonCoords]); // Crear polígono con Turf.js

        return booleanPointInPolygon(pointToCheck, turfPolygon); // Verificar si el punto está dentro del polígono
    });

    return zone || null; // Retornar la zona encontrada o null si no pertenece a ninguna
}

async function getCoordinates(params:string) {
    return routeService.getCoordinates(params);
}



export {
    getZoneInCoords,
    getCoordinates
}