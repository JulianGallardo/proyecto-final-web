"use server";
import ZoneRepository from "@/repositories/ZoneRepository";
import { ExtendedZone } from "@/types/ZoneTypes";
import { point, polygon, booleanPointInPolygon, centroid, bbox, bboxPolygon, intersect } from "@turf/turf";
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

    const pointToCheck = point([lat, long]); // Crear un punto con Turf.js
    // Obtener el polígono de la zona seleccionada
    const polygonCoords = zone.geometry.coordinates.map(coord => [coord.latitude, coord.longitude]);
    const turfPolygon = polygon([polygonCoords]);

    // Obtener el centroide y los límites del polígono
    const center = centroid(turfPolygon);
    const [minX, minY, maxX, maxY] = bbox(turfPolygon);

    // Crear los 4 sub-polígonos usando bboxPolygon
    const topLeftBox = bboxPolygon([minX, center.geometry.coordinates[1], center.geometry.coordinates[0], maxY]);
    const topRightBox = bboxPolygon([center.geometry.coordinates[0], center.geometry.coordinates[1], maxX, maxY]);
    const bottomLeftBox = bboxPolygon([minX, minY, center.geometry.coordinates[0], center.geometry.coordinates[1]]);
    const bottomRightBox = bboxPolygon([center.geometry.coordinates[0], minY, maxX, center.geometry.coordinates[1]]);



    // Intersecar los bounding boxes con el polígono original para obtener las subzonas reales
    const subzones = [
        { name: SubZona.A, polygon: intersect({ type: "FeatureCollection", features: [turfPolygon, topLeftBox] }) },
        { name: SubZona.B, polygon: intersect({ type: "FeatureCollection", features: [turfPolygon, topRightBox] }) },
        { name: SubZona.C, polygon: intersect({ type: "FeatureCollection", features: [turfPolygon, bottomLeftBox] }) },
        { name: SubZona.D, polygon: intersect({ type: "FeatureCollection", features: [turfPolygon, bottomRightBox] }) }
    ].filter(subzone => subzone.polygon); // Filtrar subzonas válidas

    console.log(
        JSON.stringify({    
            subzones: subzones,
            pointToCheck: pointToCheck,
            zoneId: zoneId
        })
    )

    if (subzones.length === 0) return null;
    const foundSubzone = subzones.find(subzone => subzone.polygon && booleanPointInPolygon(pointToCheck, subzone.polygon));

    return foundSubzone ? foundSubzone.name : SubZona.Sin_SubZona; // Retornar la subzona correspondiente
}



async function getCoordinates(params: string) {
    return routeService.getCoordinates(params);
}



export {
    getZoneInCoords,
    getSubzoneInCoords,
    getCoordinates
}