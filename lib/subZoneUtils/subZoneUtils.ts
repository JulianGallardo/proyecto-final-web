import { toast } from "@/hooks/use-toast";
import { CustomFeature, DrawingModesSubZonas, FeatureId, Position } from "@/types/MapTypes";
import * as turf from "@turf/turf";
import { GeoJSONStoreFeatures, TerraDraw } from "terra-draw";
import { MaplibreTerradrawControl } from "@watergis/maplibre-gl-terradraw";
import React from "react";
import { isIntersectingWithMapPolygon, isSelfIntersectingPolygon, reDrawPolygonWithNoIntersection } from "../mapUtils/terraDrawUtils";
import { ExtendedZone } from "@/types/ZoneTypes";


function getFeatureById(draw: MaplibreTerradrawControl, id: string) {
    return draw.getFeatures()?.features?.find((feature: GeoJSON.Feature) => feature.id === id);
}

function handleFinishSubzones(
    id: FeatureId,
    context: { action: string, mode: string },
    draw: MaplibreTerradrawControl,
    addNewZoneToMap: (zone: CustomFeature, isUpdated?: boolean) => void,
    setMode: (mode: DrawingModesSubZonas) => void,
    setZones: React.Dispatch<React.SetStateAction<CustomFeature[]>>,
    zone: ExtendedZone

) {
    const parsedId = id as string;
    const newFeature = getFeatureById(draw, parsedId);
    const { action, mode } = context;

    const terraDrawInstance = draw.getTerraDrawInstance();

    if (action === "draw" && mode === "polygon" && newFeature) {
        handleCreateSubArea(newFeature, zone, terraDrawInstance, draw, setMode, setZones, addNewZoneToMap);
    }

    if (action === "dragCoordinate" && newFeature?.id) {
        console.log("dragCoordinate", newFeature.id);
        handleEditIntersections(draw, newFeature, zone, terraDrawInstance, addNewZoneToMap);
    }
}

function handleEditIntersections(draw: MaplibreTerradrawControl, newFeature: GeoJSONStoreFeatures, zone: ExtendedZone, terraDrawInstance: TerraDraw, addNewZoneToMap: (zone: CustomFeature, isUpdated?: boolean) => void) {

    let intersectsWithZonePolygon = false;
    if (newFeature?.id === undefined) return;



    const newSubZoneDelimited = adjustSubzoneToZoneBoundaries(newFeature, zone);

    if (newSubZoneDelimited !== null) {
        intersectsWithZonePolygon = true;
    }


    if (newSubZoneDelimited === null) {
        toast({
            title: "Error",
            description: "No se puede hacer la diferencia entre los poligonos ya que genera un área partida",
            className: "bg-red-500 text-white",
            duration: 3000,
        });
        terraDrawInstance.removeFeatures([newFeature.id]);
        return;
    }

    console.log("newFeature aa", newSubZoneDelimited.id);

    const features = draw.getFeatures()?.features.filter((feature) => feature.id !== newFeature?.id);
    const intersectsWith = isIntersectingWithMapPolygon(newSubZoneDelimited, features);
    if (intersectsWith.length > 0) {


        intersectsWith.forEach(featureIntersected => {
            const newIntersectedFeatured = reDrawPolygonEditWithNoIntersection(featureIntersected, [newSubZoneDelimited]);
            if (featureIntersected?.id) {
                featureIntersected.geometry.coordinates = newIntersectedFeatured.geometry.coordinates as Position[][];
                terraDrawInstance.removeFeatures([featureIntersected.id]);
                addNewZoneToMap(featureIntersected as CustomFeature, true);
            }
        });
    }


    if (intersectsWithZonePolygon) {
        terraDrawInstance.deselectFeature(newFeature.id as FeatureId);
        terraDrawInstance.removeFeatures([newFeature.id]);
        addNewZoneToMap(newSubZoneDelimited as CustomFeature, true);
        terraDrawInstance.selectFeature(newSubZoneDelimited.id as FeatureId);
    }



}

function reDrawPolygonEditWithNoIntersection(
    polygonToDraw: GeoJSONStoreFeatures,
    polygonsInMap: GeoJSONStoreFeatures[]
) {
    const polygonCoords: Position[][] = polygonToDraw.geometry.coordinates as Position[][];
    const otherPolygonCoords = polygonsInMap.map((polygon) => {
        return polygon.geometry.coordinates as Position[][];
    });

    const polygon = turf.polygon(polygonCoords);
    const otherPolygons = otherPolygonCoords.map((coords) => {
        return turf.polygon(coords);
    });


    const dissolvedPolygons = turf.dissolve(turf.featureCollection(otherPolygons));


    dissolvedPolygons.features.forEach(polygonToDelete => {
        const difference = turf.difference(turf.featureCollection([polygon, polygonToDelete]));
        if (difference === null) return null;


        if (difference.geometry.type === "Polygon") {
            polygon.geometry.coordinates = difference.geometry.coordinates;
        }
        else throw new Error("No se puede hacer la diferencia entre los poligonos ya que genera un área partida");

    });


    return turf.truncate(polygon, { precision: 9 });;

}





function handleCreateSubArea(
    newFeature: GeoJSONStoreFeatures,
    zone: ExtendedZone,
    terraDrawInstance: TerraDraw,
    draw: MaplibreTerradrawControl,
    setMode: (mode: DrawingModesSubZonas) => void,
    setZones: React.Dispatch<React.SetStateAction<CustomFeature[]>>,
    addNewZoneToMap: (zone: CustomFeature) => void
) {
    let intersectsWithMapPolygon = false;
    let intersectsWithZone = false;

    if (newFeature?.id === undefined) return;



    if (isSelfIntersectingPolygon(newFeature)) {
        toast({
            title: "Error",
            description: "La zona no puede tener intersecciones consigo misma",
            className: "bg-red-500 text-white",
            duration: 3000,
        });
        terraDrawInstance.removeFeatures([newFeature.id]);

        return;
    }

    const features = draw.getFeatures()?.features.filter((feature) => feature.id !== newFeature.id);


    const newSubZoneDelimited = adjustSubzoneToZoneBoundaries(newFeature, zone);



    if (newSubZoneDelimited !== null) {
        intersectsWithZone = true;
    } else {
        toast({
            title: "Error",
            description: "No se puede hacer la diferencia entre los poligonos ya que genera un área partida",
            className: "bg-red-500 text-white",
            duration: 3000,
        });
        terraDrawInstance.removeFeatures([newFeature.id]);
        return;
    }

    console.log("newFeature", newSubZoneDelimited.id);

    const intersectsWith = isIntersectingWithMapPolygon(newSubZoneDelimited, features);

    try {

        if (intersectsWith.length > 0) {
            intersectsWithMapPolygon = true;
            const newPolygon = reDrawPolygonWithNoIntersection(newSubZoneDelimited, intersectsWith);
            if (newPolygon !== null) {
                newFeature.geometry.coordinates = newPolygon.geometry.coordinates as Position[][];
            }
        }
        else {
            newFeature.geometry.coordinates = newSubZoneDelimited.geometry.coordinates as Position[][];
        }



    } catch (error) {
        if (error instanceof Error) {
            toast({
                title: "Error",
                description: "No se puede hacer la diferencia entre los poligonos ya que genera un área partida",
                className: "bg-red-500 text-white",
                duration: 3000,
            });
            console.warn(error.message);
            terraDrawInstance.removeFeatures([newFeature.id]);
            return;
        }

    }



    const newZoneInfo = JSON.parse(localStorage.getItem("newSubZone") as string);

    localStorage.removeItem("newSubZone")


    newFeature.properties.color = newZoneInfo.color;
    newFeature.properties.editable = false;
    newFeature.properties.name = newZoneInfo.name;

    if (intersectsWithMapPolygon || intersectsWithZone) {
        terraDrawInstance.removeFeatures([newFeature.id]);
        addNewZoneToMap(newFeature as CustomFeature);
    }

    setZones((prevZones) => [...prevZones, newFeature as CustomFeature]);

    terraDrawInstance.setMode("render");
    setMode(DrawingModesSubZonas.SinSeleccionar);
}

/**
 * Ajusta una subzona para que quede completamente dentro de los límites de una zona
 * 
 * @param subzone - Feature GeoJSON de la subzona que se quiere ajustar
 * @param zone - Feature GeoJSON de la zona principal que limita a la subzona
 * @returns CustomFeature con la geometría de la subzona ajustada o null si no es posible ajustarla
 */
function adjustSubzoneToZoneBoundaries(
    subzone: GeoJSONStoreFeatures,
    zone: ExtendedZone
): GeoJSONStoreFeatures | null {
    try {


        // Crear objetos turf para trabajar con ellos
        const subzonePolygon = turf.polygon(
            subzone.geometry.coordinates as Position[][]
        );


        const zoneCoords = zone.geometry.coordinates.map((coords) => [
            coords.latitude,
            coords.longitude
        ]);


        const zonePolygon = turf.polygon([zoneCoords]);


        // Verificar si la subzona ya está completamente dentro de la zona
        const isWithin = turf.booleanWithin(subzonePolygon, zonePolygon);


        if (isWithin) {
            // Si ya está dentro, retornar la subzona sin cambios
            return subzone as CustomFeature;
        }

        // Calcular la intersección entre la subzona y la zona
        const intersection = turf.intersect(turf.featureCollection([subzonePolygon, zonePolygon]));


        // Si no hay intersección (están completamente separados)
        if (!intersection) {
            // Si están completamente separados, podemos centrar la subzona dentro de la zona
            // y ajustar su tamaño para que quepa

            // Obtener el centro de la zona
            const zoneCenter = turf.centroid(zonePolygon);

            // Calcular un nuevo polígono centrado en la zona con un tamaño que sea
            // aproximadamente el 80% del tamaño de la zona para asegurar que quepa
            const zoneBBox = turf.bbox(zonePolygon);
            const zoneWidth = zoneBBox[2] - zoneBBox[0];
            const zoneHeight = zoneBBox[3] - zoneBBox[1];

            // Crear un círculo que representa la nueva subzona (podría reemplazarse por otra forma)
            const newSubzone = turf.circle(
                zoneCenter,
                Math.min(zoneWidth, zoneHeight) * 0.4, // Radio de 40% del ancho/alto mínimo
                { steps: 24 } // Más pasos para un círculo más suave
            );

            // Copiar propiedades de la subzona original a la nueva
            if (subzone.properties) {
                newSubzone.properties = { ...subzone.properties };
            }

            if (subzone.id) {
                newSubzone.id = subzone.id;
            }


            return newSubzone as CustomFeature;
        }

        // Si hay una intersección, usar esa intersección como la nueva subzona
        // Asegurar que el resultado es un polígono simple
        if (intersection.geometry.type === "Polygon") {
            // Copiar propiedades y ID de la subzona original
            if (subzone.properties) {
                intersection.properties = { ...subzone.properties };
            }

            if (subzone.id) {
                intersection.id = subzone.id;
            }

            const newSubZone = turf.truncate(intersection, { precision: 9 }) as CustomFeature;

            return newSubZone;
        } else if (intersection.geometry.type === "MultiPolygon") {
            // Si la intersección genera un multipolígono, tomamos el polígono más grande
            const areas = intersection.geometry.coordinates.map(coords => {
                const poly = turf.polygon(coords as Position[][]);
                return {
                    coords,
                    area: turf.area(poly)
                };
            });

            // Ordenar por área de mayor a menor
            areas.sort((a, b) => b.area - a.area);

            // Crear un polígono con la parte más grande
            const largestPart = turf.polygon(areas[0].coords as Position[][]);

            // Copiar propiedades e ID
            if (subzone.properties) {
                largestPart.properties = { ...subzone.properties };
            }

            if (subzone.id) {
                largestPart.id = subzone.id;
            }

            return turf.truncate(largestPart, { precision: 9 }) as CustomFeature;
        }

        // Si llegamos aquí, no pudimos ajustar la subzona correctamente
        return null;

    } catch (error) {
        console.error("Error al ajustar la subzona a los límites de la zona:", error);
        return null;
    }
}




export { handleFinishSubzones };
