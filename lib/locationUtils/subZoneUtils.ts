"use server";
import { bbox, bboxPolygon, centroid, intersect, polygon } from "@turf/turf";
import { SubZona } from "@prisma/client";
import { CustomFeature, Position } from "@/types/MapTypes";



async function createSubZones(zone: CustomFeature) {

    // Obtener el polígono de la zona seleccionada
    const polygonCoords: Position[] = zone.geometry.coordinates.flat(1) as Position[];
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
    ].filter(subzone => subzone.polygon);

    return subzones;
}




export {
    createSubZones,
}