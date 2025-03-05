"use server";

import { 
  bbox, bboxPolygon, polygon, area, intersect, featureCollection,
  distance, centroid, multiPolygon, union
} from "@turf/turf";
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

// Función para verificar si es un multipolígono
function isMultiPolygon(geom: any): boolean {
  return geom?.geometry?.type === 'MultiPolygon' || 
         (geom?.geometry?.coordinates && geom.geometry.coordinates.length > 1 && 
         Array.isArray(geom.geometry.coordinates[0]) && 
         Array.isArray(geom.geometry.coordinates[0][0]));
}

// Función para fusionar multipolígonos con la subzona más cercana
function mergeMultiPolygonsWithNearestZone(subzones: { name: SubZona; polygon: any }[]): { name: SubZona; polygon: any }[] {
  // Primero identificamos subzonas con multipolígonos y subzonas con polígonos simples
  const multiPolygonSubzones = subzones.filter(sz => isMultiPolygon(sz.polygon));
  const singlePolygonSubzones = subzones.filter(sz => !isMultiPolygon(sz.polygon));
  
  if (multiPolygonSubzones.length === 0) {
    return subzones; // No hay multipolígonos que procesar
  }
  
  // Procesamos cada multipolígono
  for (const multiSz of multiPolygonSubzones) {
    // Si hay al menos un polígono simple, fusionamos los multipolígonos
    if (singlePolygonSubzones.length > 0) {
      const multiCentroid = centroid(multiSz.polygon);
      
      // Encontrar la subzona más cercana
      let closestSubzone = null;
      let minDistance = Infinity;
      
      for (const singleSz of singlePolygonSubzones) {
        const singleCentroid = centroid(singleSz.polygon);
        const dist = distance(multiCentroid, singleCentroid);
        
        if (dist < minDistance) {
          minDistance = dist;
          closestSubzone = singleSz;
        }
      }
      
      // Fusionar el multipolígono con la subzona más cercana
      if (closestSubzone) {
        closestSubzone.polygon = union(featureCollection([closestSubzone.polygon, multiSz.polygon]));
      }
    }
  }
  
  // Devolver solo las subzonas con polígonos simples (ya fusionadas)
  return singlePolygonSubzones;
}

async function validateAndFixSubZones(subzones: { name: SubZona; polygon: any }[]): Promise<ValidatedSubzone[]> {
  // Primero fusionamos los multipolígonos con las subzonas cercanas
  const mergedSubzones = mergeMultiPolygonsWithNearestZone(subzones);
  
  return mergedSubzones.map(subzone => {
    if (!subzone.polygon?.geometry?.coordinates) {
      return {
        ...subzone,
        isValid: false,
        error: "Invalid polygon structure"
      };
    }

    // Para polígonos normales
    if (subzone.polygon.geometry.type === 'Polygon') {
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
    } 
    
    return {
      ...subzone,
      isValid: true,
      error: "Complex geometry handled"
    };
  });
}

// Función para encontrar la orientación principal del polígono
function findPolygonOrientation(turfPolygon: any): number {
  const [minX, minY, maxX, maxY] = bbox(turfPolygon);
  const width = maxX - minX;
  const height = maxY - minY;
  
  // Si el polígono es más ancho que alto, la orientación es horizontal
  // De lo contrario, es vertical
  return width > height ? 0 : 90;
}

// Función para dividir en dos partes iguales según una orientación
function dividePolygonInTwo(turfPolygon: any, orientation: number = 0): any[] {
  const [minX, minY, maxX, maxY] = bbox(turfPolygon);
  const totalPoints = 50; // Número de puntos a probar para encontrar la división óptima
  
  // Determinar el eje de división basado en la orientación
  const isHorizontal = orientation % 180 === 0;
  
  let bestDivision = null;
  let bestAreaDifference = Infinity;
  
  // Probar diferentes puntos de división a lo largo del eje
  for (let i = 1; i < totalPoints; i++) {
    const ratio = i / totalPoints;
    let box1, box2;
    
    if (isHorizontal) {
      // División horizontal
      const divY = minY + (maxY - minY) * ratio;
      box1 = bboxPolygon([minX, minY, maxX, divY]);
      box2 = bboxPolygon([minX, divY, maxX, maxY]);
    } else {
      // División vertical
      const divX = minX + (maxX - minX) * ratio;
      box1 = bboxPolygon([minX, minY, divX, maxY]);
      box2 = bboxPolygon([divX, minY, maxX, maxY]);
    }
    
    // Crear las intersecciones
    const part1 = intersect(featureCollection([turfPolygon, box1]));
    const part2 = intersect(featureCollection([turfPolygon, box2]));
    
    if (part1 && part2) {
      const area1 = area(part1);
      const area2 = area(part2);
      const areaDifference = Math.abs(area1 - area2);
      
      if (areaDifference < bestAreaDifference) {
        bestAreaDifference = areaDifference;
        bestDivision = { part1, part2, divisionRatio: ratio };
      }
    }
  }
  
  return bestDivision ? [bestDivision.part1, bestDivision.part2] : [turfPolygon];
}

async function createSubZones(zone: CustomFeature): Promise<ValidatedSubzone[]> {
  // Obtener el polígono de la zona seleccionada
  const polygonCoords: Position[] = zone.geometry.coordinates.flat(1) as Position[];
  const turfPolygon = polygon([polygonCoords]);
  
  try {
    // Determinar la orientación principal del polígono
    const primaryOrientation = findPolygonOrientation(turfPolygon);
    const secondaryOrientation = (primaryOrientation + 90) % 180;
    
    // Dividir primero en dos partes usando la orientación principal
    const firstDivision = dividePolygonInTwo(turfPolygon, primaryOrientation);
    
    if (firstDivision.length < 2) {
      // Si la primera división falló, intentamos con una división más simple
      throw new Error("Primera división falló");
    }
    
    // Luego dividir cada parte usando la orientación secundaria
    const part1Division = dividePolygonInTwo(firstDivision[0], secondaryOrientation);
    const part2Division = dividePolygonInTwo(firstDivision[1], secondaryOrientation);
    
    // Crear las cuatro subzonas
    const subzones = [
      { name: SubZona.A, polygon: part1Division[0] },
      { name: SubZona.B, polygon: part1Division[1] || part1Division[0] },
      { name: SubZona.C, polygon: part2Division[0] },
      { name: SubZona.D, polygon: part2Division[1] || part2Division[0] }
    ].filter(subzone => subzone.polygon);
    
    // Validar y corregir las subzonas antes de devolverlas
    const validatedSubzones = await validateAndFixSubZones(subzones);
    return validatedSubzones;
  } catch (error) {
    console.log("Error en la división avanzada, usando método de respaldo:", error);
    // Método alternativo más simple en caso de error
    return createSubZonesSimple(turfPolygon);
  }
}

// Método de respaldo más simple que utiliza un enfoque de cuadrantes
async function createSubZonesSimple(turfPolygon: any): Promise<ValidatedSubzone[]> {
  const [minX, minY, maxX, maxY] = bbox(turfPolygon);
  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;
  
  // Crear los cuatro cuadrantes
  const boxes = [
    bboxPolygon([minX, midY, midX, maxY]), // Superior izquierda
    bboxPolygon([midX, midY, maxX, maxY]), // Superior derecha
    bboxPolygon([minX, minY, midX, midY]), // Inferior izquierda
    bboxPolygon([midX, minY, maxX, midY])  // Inferior derecha
  ];
  
  // Crear las subzonas mediante intersección
  const subzones = [
    { name: SubZona.A, polygon: intersect(featureCollection([turfPolygon, boxes[0]])) },
    { name: SubZona.B, polygon: intersect(featureCollection([turfPolygon, boxes[1]])) },
    { name: SubZona.C, polygon: intersect(featureCollection([turfPolygon, boxes[2]])) },
    { name: SubZona.D, polygon: intersect(featureCollection([turfPolygon, boxes[3]])) }
  ].filter(subzone => subzone.polygon);
  
  // Validar y corregir las subzonas
  return await validateAndFixSubZones(subzones);
}

export {
  createSubZones,
  validateAndFixSubZones,
  validateAndFixPolygonCoordinates
}