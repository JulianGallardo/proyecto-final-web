import { toast } from "@/hooks/use-toast";
import { CustomFeature, DrawingModes, FeatureId, Position } from "@/types/MapTypes";
import * as turf from "@turf/turf";
import { GeoJSONStoreFeatures } from "terra-draw";
import { getZoneInfoFromLocalStorage } from "./localStorageUtils";
import { MaplibreTerradrawControl } from "@watergis/maplibre-gl-terradraw";
import React from "react";
import { Feature, GeoJsonProperties, Polygon } from "geojson";


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

        const intersectsWith = isIntersectingWithMapPolygon(newFeature, features);
        if (intersectsWith.length > 0) {
            intersectsWithMapPolygon = true;
            const newPolygon = reDrawPolygonWithNoIntersection(newFeature, intersectsWith);
            if (newPolygon !== null) {
                newFeature.geometry.coordinates = newPolygon.geometry.coordinates as Position[][];
            }
        }
        console.log(intersectsWith);
        const newZoneInfo = getZoneInfoFromLocalStorage();

        newFeature.properties.color = newZoneInfo.color;
        newFeature.properties.editable = false;
        newFeature.properties.name = newZoneInfo.name;

        if (intersectsWithMapPolygon) {
            terraDrawInstance.removeFeatures([newFeature.id]);
            addNewZoneToMap(newFeature as CustomFeature);
        }

        setZones((prevZones) => [...prevZones, newFeature as CustomFeature]);


        terraDrawInstance.setMode("render");
        setMode(DrawingModes.SinSeleccionar);
    }

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
): GeoJSONStoreFeatures[] {
    if (polygonsInMap.length === 0) return [];

    const polygonCoords: Position[][] = polygonToDraw.geometry.coordinates as Position[][];
    const otherPolygonCoords = polygonsInMap.map((polygon) => {
        return polygon.geometry.coordinates as Position[][];
    });

    const polygon = turf.polygon(polygonCoords);
    const otherPolygons = otherPolygonCoords.map((coords) => {
        return turf.polygon(coords);
    });

    const intersectsWith: GeoJSONStoreFeatures[] = [];

    while (otherPolygons.length > 0) {
        const otherPolygon = otherPolygons.pop();
        if (!otherPolygon) continue;

        const intersectionResult = turf.intersect(turf.featureCollection([polygon, otherPolygon]));
        if (intersectionResult) {
            const intersectedPolygon: GeoJSONStoreFeatures = {
                type: "Feature",
                geometry: {
                    type: "Polygon",
                    coordinates: intersectionResult.geometry.coordinates as Position[][],
                },
                properties: {
                    type: "polygon"
                },
            };
            intersectsWith.push(intersectedPolygon);
        }
    }

    return intersectsWith
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
    const otherPolygons = otherPolygonCoords.map((coords) => {
        return turf.polygon(coords);
    });


    const otherPolygonsParsed = turf.truncate(turf.featureCollection(otherPolygons), { precision: 9 });

    otherPolygonsParsed.features.forEach(polygonToDelete => {


        const difference = turf.difference(turf.featureCollection([polygon, polygonToDelete]));
        if (difference === null) return null;


        if (difference.geometry.type === "Polygon") {
            const CleanDifference = turf.simplify(difference, { tolerance: 0.0001, highQuality: true });
            const ParsedCords = turf.truncate(CleanDifference, { precision: 9 });
            polygon.geometry.coordinates = ParsedCords.geometry.coordinates as Position[][];
        }
        else console.warn("No se pudo limpiar la intersección");
    });

    console.log(polygon)

    return polygon;

}





export { isSelfIntersectingPolygon, isIntersectingWithMapPolygon, reDrawPolygonWithNoIntersection, handleFinish };
