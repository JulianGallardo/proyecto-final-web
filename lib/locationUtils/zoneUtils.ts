"use server";
import ZoneRepository from "@/repositories/ZoneRepository";
import { ExtendedZone } from "@/types/ZoneTypes";
import { point, polygon, booleanPointInPolygon } from "@turf/turf";
import { RouteService } from "./routeService";
import { SubZona } from "@prisma/client";

const zoneRepo = new ZoneRepository();
const routeService = new RouteService();

interface ZoneResult {
  success: boolean;
  zone: ExtendedZone | null;
  error?: string;
}

interface SubzoneResult {
  success: boolean;
  subzone: string | null;
  error?: string;
}

interface CoordinatesResult {
  success: boolean;
  coordinates?: number[];
  error?: string;
}

async function getZoneInCoords(lat: number, long: number): Promise<ZoneResult> {
  try {
    if (!lat || !long || isNaN(lat) || isNaN(long)) {
      return {
        success: false,
        zone: null,
        error: "Coordenadas inválidas"
      };
    }

    const zones: ExtendedZone[] = await zoneRepo.getAll();
    
    if (!zones || zones.length === 0) {
      return {
        success: false,
        zone: null,
        error: "No se encontraron zonas disponibles"
      };
    }

    const pointToCheck = point([long, lat]);

    const zone = zones.find((zone: ExtendedZone) => {
      try {
        const polygonCoords = zone.geometry.coordinates.map(coord => [coord.longitude, coord.latitude]);
        const turfPolygon = polygon([polygonCoords]);
        return booleanPointInPolygon(pointToCheck, turfPolygon);
      } catch (e) {
        console.error(`Error al procesar zona ${zone.id}:`, e);
        return false;
      }
    });

    return {
      success: !!zone,
      zone: zone || null
    };
  } catch (error) {
    console.error("Error en getZoneInCoords:", error);
    return {
      success: false,
      zone: null,
      error: "Error al buscar zona por coordenadas"
    };
  }
}

async function getSubzoneInCoords(lat: number, long: number, zoneId: string): Promise<SubzoneResult> {
  try {
    if (!lat || !long || isNaN(lat) || isNaN(long)) {
      return {
        success: false,
        subzone: null,
        error: "Coordenadas inválidas"
      };
    }

    if (!zoneId) {
      return {
        success: false,
        subzone: null,
        error: "ID de zona requerido"
      };
    }

    const zone = await zoneRepo.getZoneById(zoneId);
    
    if (!zone) {
      return {
        success: false,
        subzone: null,
        error: `Zona con ID ${zoneId} no encontrada`
      };
    }
    
    const subzones = zone.SubZonas;
    
    if (!subzones || subzones.length === 0) {
      return {
        success: true,
        subzone: SubZona.Sin_SubZona
      };
    }

    const pointToCheck = point([long, lat]);

    const foundSubzone = subzones.find((subzone) => {
      try {
        const polygonCoords = subzone.geometry.coordinates.map(coord => [coord.longitude, coord.latitude]);
        const turfPolygon = polygon([polygonCoords]);
        return booleanPointInPolygon(pointToCheck, turfPolygon);
      } catch (e) {
        console.error(`Error al procesar subzona ${subzone.id}:`, e);
        return false;
      }
    });

    const result = foundSubzone?.zoneName ?? SubZona.Sin_SubZona;

    return {
      success: true,
      subzone: result
    };
  } catch (error) {
    console.error("Error en getSubzoneInCoords:", error);
    return {
      success: false,
      subzone: null,
      error: "Error al obtener la subzona en coordenadas"
    };
  }
}

async function getCoordinates(params: string): Promise<CoordinatesResult> {
  try {
    if (!params) {
      return {
        success: false,
        error: "Parámetros de búsqueda requeridos"
      };
    }
    
    const coordinates = await routeService.getCoordinates(params);
    
    if (!coordinates) {
      return {
        success: false,
        error: "No se encontraron coordenadas para los parámetros proporcionados"
      };
    }
    
    return {
      success: true,
      coordinates
    };
  } catch (error) {
    console.error("Error en getCoordinates:", error);
    return {
      success: false,
      error: "Error al obtener coordenadas"
    };
  }
}

export {
  getZoneInCoords,
  getSubzoneInCoords,
  getCoordinates
}