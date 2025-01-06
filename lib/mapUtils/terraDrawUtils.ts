import { toast } from "@/hooks/use-toast";
import { CustomFeature, DrawingModes, FeatureId, Position } from "@/types/MapTypes";
import * as turf from "@turf/turf";
import { GeoJSONStoreFeatures } from "terra-draw";
import { getZoneInfoFromLocalStorage } from "./localStorageUtils";
import { MaplibreTerradrawControl } from "@watergis/maplibre-gl-terradraw";
import React from "react";


function getFeatureById(draw: MaplibreTerradrawControl, id: string) {
    return draw.getFeatures()?.features?.find((feature: GeoJSON.Feature) => feature.id === id);
}

function handleFinish(
    id: FeatureId,
    context: { action: string, mode: string },
    draw: MaplibreTerradrawControl,
    addNewZoneToMap: (zone: CustomFeature) => void,
    setMode: (mode: DrawingModes) => void,
    setZones: React.Dispatch<React.SetStateAction<CustomFeature[]>>,

) {
    const parsedId = id as string;
    const newFeature = getFeatureById(draw, parsedId);
    const { action, mode } = context;
    let intersectsWithMapPolygon = false;
    const terraDrawInstance = draw.getTerraDrawInstance();

    if (action === "draw" && mode === "polygon" && newFeature?.id) {

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
        console.log("features en mapa, ",draw.getFeatures()?.features);
        console.log(newFeature.id);
        if(isIntersectingWithMapPolygon(newFeature,features)) {
            intersectsWithMapPolygon = true;
            const newPolygon = reDrawPolygonWithNoIntersection(newFeature, features);
            if (newPolygon !== null) {
                newFeature.geometry.coordinates = newPolygon.geometry.coordinates as Position[][];
            }
        }
        console.log(intersectsWithMapPolygon);
        const newZoneInfo = getZoneInfoFromLocalStorage();

        newFeature.properties.color = newZoneInfo.color;
        newFeature.properties.editable = false;
        newFeature.properties.name = newZoneInfo.name;

        if (intersectsWithMapPolygon) {
            terraDrawInstance.removeFeatures([newFeature.id]);
            addNewZoneToMap(newFeature as CustomFeature);
        }

        setZones((prevZones) => [...prevZones, newFeature as CustomFeature]);
    }
    terraDrawInstance.setMode("render");
    setMode(DrawingModes.SinSeleccionar);

}

/**
 * Checks if a polygon has self-intersections.
 * @param {GeoJSONStoreFeatures} polygonToDraw - The polygon to check.
 * @returns {boolean} - True if the polygon is self-intersecting, false otherwise.
 */
function isSelfIntersectingPolygon(polygonToDraw: GeoJSONStoreFeatures): boolean {
    const polygonCoords: Position[][] = polygonToDraw.geometry.coordinates as Position[][];
    const polygon = turf.polygon(polygonCoords);
    return turf.kinks(polygon).features.length > 0;
}


function isIntersectingWithMapPolygon(
    polygonToDraw: GeoJSONStoreFeatures,
    polygonsInMap: GeoJSONStoreFeatures[]
): boolean {
    if (polygonsInMap.length === 0) return false;
    
    const polygonCoords: Position[][] = polygonToDraw.geometry.coordinates as Position[][];
    const otherPolygonCoords = polygonsInMap.map((polygon) => {
        return polygon.geometry.coordinates as Position[][];
    });

    const polygon = turf.polygon(polygonCoords);
    const otherPolygons= otherPolygonCoords.map((coords) => {
        return turf.polygon(coords);
    });

    let intersection = false;
    
    while (otherPolygons.length > 0 && !intersection) {
        const otherPolygon = otherPolygons.pop();
        if (!otherPolygon) return false;
        const intersectionResult = turf.intersect(turf.featureCollection([polygon, otherPolygon]));
        intersection = !!intersectionResult;
    }
   
    if (intersection) {
        return true;
    } else {
        return false;
    }
}


function reDrawPolygonWithNoIntersection(
    polygonToDraw: GeoJSONStoreFeatures,
    polygonsInMap: GeoJSONStoreFeatures[]
) {
    const polygonCoords: Position[][] = polygonToDraw.geometry.coordinates as Position[][];
    const otherPolygonCoords = polygonsInMap.map((polygon) => {
        return polygon.geometry.coordinates as Position[][];
    });

    const polygon = turf.polygon(polygonCoords);
    const otherPolygons= otherPolygonCoords.map((coords) => {
        return turf.polygon(coords);
    });

    const otherPolygonsCollection = turf.featureCollection([polygon, ...otherPolygons]);


    const difference = turf.difference(otherPolygonsCollection);
    console.log("difference,",difference);
    try {
        if (difference) {
            difference.geometry.coordinates = difference.geometry.coordinates.map((coord) => {
                return coord.map((c) => {
                    const parsedCoords = [
                        Number((c as number[])[0].toFixed(9)),
                        Number((c as number[])[1].toFixed(9)),
                    ]

                    return parsedCoords;
                });
            });

        }
    } catch (error) {
        throw new Error("Error al intentar dibujar la zona");
    }
    return difference;

}


export { isSelfIntersectingPolygon, isIntersectingWithMapPolygon, reDrawPolygonWithNoIntersection, handleFinish };
