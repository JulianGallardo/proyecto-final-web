"use server";
import { bbox, bboxPolygon, centroid, intersect, polygon, area, point, featureCollection } from "@turf/turf";
import { SubZona } from "@prisma/client";
import { CustomFeature, Position } from "@/types/MapTypes";

async function createSubZones(zone: CustomFeature) {
    // Obtener el polígono de la zona seleccionada
    const polygonCoords: Position[] = zone.geometry.coordinates.flat(1) as Position[];
    const turfPolygon = polygon([polygonCoords]);
    
    
    // Obtener el centroide inicial
    const initialCenter = centroid(turfPolygon);
    const [minX, minY, maxX, maxY] = bbox(turfPolygon);
    
    // Ajustar el centro para obtener áreas más equilibradas
    let bestCenter = { x: initialCenter.geometry.coordinates[0], y: initialCenter.geometry.coordinates[1] };
    let bestAreaDiff = Infinity;
    
    // Buscar el mejor punto de división probando diferentes posiciones
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            const testX = minX + (maxX - minX) * (i / 4);
            const testY = minY + (maxY - minY) * (j / 4);
            
            // Crear las cuatro subzonas con el punto de prueba
            const testBoxes = [
                bboxPolygon([minX, testY, testX, maxY]),
                bboxPolygon([testX, testY, maxX, maxY]),
                bboxPolygon([minX, minY, testX, testY]),
                bboxPolygon([testX, minY, maxX, testY])
            ];
            
            // Calcular las áreas de las intersecciones
            const areas = testBoxes.map(box => {
                const intersection = intersect(featureCollection([turfPolygon, box]));
                return intersection ? area(intersection) : 0;
            });
            
            // Calcular la diferencia máxima entre áreas
            const maxAreaDiff = Math.max(...areas) - Math.min(...areas);
            
            if (maxAreaDiff < bestAreaDiff) {
                bestAreaDiff = maxAreaDiff;
                bestCenter = { x: testX, y: testY };
            }
        }
    }
    
    // Crear las subzonas finales usando el mejor punto encontrado
    const subBoxes = [
        bboxPolygon([minX, bestCenter.y, bestCenter.x, maxY]),
        bboxPolygon([bestCenter.x, bestCenter.y, maxX, maxY]),
        bboxPolygon([minX, minY, bestCenter.x, bestCenter.y]),
        bboxPolygon([bestCenter.x, minY, maxX, bestCenter.y])
    ];
    
    // Crear las subzonas finales con sus nombres
    const subzones = [
        { name: SubZona.A, polygon: intersect(featureCollection([turfPolygon, subBoxes[0]])) },
        { name: SubZona.B, polygon: intersect(featureCollection([turfPolygon, subBoxes[1]])) },
        { name: SubZona.C, polygon: intersect(featureCollection([turfPolygon, subBoxes[2]])) },
        { name: SubZona.D, polygon: intersect(featureCollection([turfPolygon, subBoxes[3]])) }
    ].filter(subzone => subzone.polygon);

    return subzones;
}

export {
    createSubZones,
}