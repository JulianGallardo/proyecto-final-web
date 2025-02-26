"use server";
import { bbox, bboxPolygon, centroid, intersect, polygon, area, feature,  featureCollection } from "@turf/turf";
import { SubZona } from "@prisma/client";
import { CustomFeature, Position } from "@/types/MapTypes";

interface ValidatedSubzone {
  name: SubZona;
  polygon: any;
  isValid: boolean;
  error?: string;
  wasFixed?: boolean;
}


function validateAndFixPolygonCoordinates(coordinates: Position[]): {
  coordinates: Position[];
  wasFixed: boolean;
} {
  if (!coordinates || coordinates.length < 4) {
    return { coordinates, wasFixed: false };
  }
  
  const firstCoord = coordinates[0];
  const lastCoord = coordinates[coordinates.length - 1];
  
  if (firstCoord[0] === lastCoord[0] && firstCoord[1] === lastCoord[1]) {
    return { coordinates, wasFixed: false };
  }
  
  // Si no coinciden, añadimos el primer punto al final
  const fixedCoordinates: Position[] = [...coordinates, [firstCoord[0], firstCoord[1]]];
  return { coordinates: fixedCoordinates, wasFixed: true };
}

async function validateAndFixSubZones(subzones: { name: SubZona; polygon: any }[]): Promise<ValidatedSubzone[]> {
  return subzones.map(subzone => {
    if (!subzone.polygon?.geometry?.coordinates) {
      return {
        ...subzone,
        isValid: false,
        error: "Invalid polygon structure"
      };
    }

    const coordinates = subzone.polygon.geometry.coordinates[0];
    const { coordinates: fixedCoordinates, wasFixed } = validateAndFixPolygonCoordinates(coordinates);

    // Si se hizo una corrección, actualizamos la geometría del polígono
    if (wasFixed) {
      subzone.polygon.geometry.coordinates[0] = fixedCoordinates;
    }

    return {
      ...subzone,
      isValid: true,
      wasFixed,
      error: wasFixed ? "Coordinates were fixed" : undefined
    };
  });
}

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
            
            const testBoxes = [
                bboxPolygon([minX, testY, testX, maxY]),
                bboxPolygon([testX, testY, maxX, maxY]),
                bboxPolygon([minX, minY, testX, testY]),
                bboxPolygon([testX, minY, maxX, testY])
            ];
            
            const areas = testBoxes.map(box => {
                const intersection = intersect(featureCollection([turfPolygon, box]));
                return intersection ? area(intersection) : 0;
            });
            
            const maxAreaDiff = Math.max(...areas) - Math.min(...areas);
            
            if (maxAreaDiff < bestAreaDiff) {
                bestAreaDiff = maxAreaDiff;
                bestCenter = { x: testX, y: testY };
            }
        }
    }
    
    const subBoxes = [
        bboxPolygon([minX, bestCenter.y, bestCenter.x, maxY]),
        bboxPolygon([bestCenter.x, bestCenter.y, maxX, maxY]),
        bboxPolygon([minX, minY, bestCenter.x, bestCenter.y]),
        bboxPolygon([bestCenter.x, minY, maxX, bestCenter.y])
    ];
    
    const subzones = [
        { name: SubZona.A, polygon: intersect(featureCollection([turfPolygon, subBoxes[0]])) },
        { name: SubZona.B, polygon: intersect(featureCollection([turfPolygon, subBoxes[1]])) },
        { name: SubZona.C, polygon: intersect(featureCollection([turfPolygon, subBoxes[2]])) },
        { name: SubZona.D, polygon: intersect(featureCollection([turfPolygon, subBoxes[3]])) }
    ].filter(subzone => subzone.polygon);

    // Validar y corregir las subzonas antes de devolverlas
    const validatedSubzones = await validateAndFixSubZones(subzones);
    
    // Log de resultados
    validatedSubzones.forEach(subzone => {
        if (subzone.wasFixed) {
            console.log(`Subzone ${subzone.name} was fixed: First and last coordinates were synchronized`);
        }
    });

    return validatedSubzones;
}

export {
    createSubZones,
    validateAndFixSubZones,
    validateAndFixPolygonCoordinates
}