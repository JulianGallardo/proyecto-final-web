"use server";
import ZoneRepository from "@/repositories/ZoneRepository";
import { ExtendedZone } from "@/types/ZoneTypes";
import { point, polygon, booleanPointInPolygon } from "@turf/turf";
import { RouteService } from "./routeService";
import { SubZona } from "@prisma/client";

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



async function getSubzoneInCoords(lat: number, long: number, zoneId: string) {


    const zone = await zoneRepo.getZoneById(zoneId); // Obtener la zona seleccionada
    if (!zone) return null; // Retornar null si la zona no existe
    const subzones = zone.SubZonas

    try {

        const pointToCheck = point([long, lat]); // Crear un punto con Turf.js

        const foundSubzone = subzones.find((subzone) => {
            const polygonCoords = subzone.geometry.coordinates.map(coord => [coord.longitude, coord.latitude]); // Convertir coordenadas

            const turfPolygon = polygon([polygonCoords]); // Crear polígono con Turf.js

            return booleanPointInPolygon(pointToCheck, turfPolygon); // Verificar si el punto está dentro del polígono
        });


        const result = foundSubzone?.zoneName ?? SubZona.Sin_SubZona;

        return result; // Retornar el nombre de la subzona encontrada o null si no pertenece a ninguna
    } catch (e) {
        console.log(e);
        throw new Error("Error al obtener la subzona en coordenadas");
    }
}


async function getCoordinates(params: string) {
    return routeService.getCoordinates(params);
}



export {
    getZoneInCoords,
    getSubzoneInCoords,
    getCoordinates
}