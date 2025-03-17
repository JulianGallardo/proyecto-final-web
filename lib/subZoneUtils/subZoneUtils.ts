import { toast } from "@/hooks/use-toast";
import { CustomFeature, DrawingModes, FeatureId, Position } from "@/types/MapTypes";
import * as turf from "@turf/turf";
import { GeoJSONStoreFeatures, TerraDraw } from "terra-draw";
import { MaplibreTerradrawControl } from "@watergis/maplibre-gl-terradraw";
import React from "react";
import { Feature, GeoJsonProperties, Polygon } from "geojson";
import { reDrawPolygonWithNoIntersection } from "../mapUtils/terraDrawUtils";


function getFeatureById(draw: MaplibreTerradrawControl, id: string) {
    return draw.getFeatures()?.features?.find((feature: GeoJSON.Feature) => feature.id === id);
}

function handleFinish(
    id: FeatureId,
    context: { action: string, mode: string },
    draw: MaplibreTerradrawControl,
    addNewZoneToMap: (zone: CustomFeature, isUpdated?: boolean) => void,
    setMode: (mode: DrawingModes) => void,
    setZones: React.Dispatch<React.SetStateAction<CustomFeature[]>>,

) {
    const parsedId = id as string;
    const newFeature = getFeatureById(draw, parsedId);
    const { action, mode } = context;

    const terraDrawInstance = draw.getTerraDrawInstance();

    if (action === "draw" && mode === "polygon" && newFeature) {
        handleCreateSubArea(newFeature, terraDrawInstance, draw, setMode, setZones, addNewZoneToMap);
    }

    if (action === "dragCoordinate" && newFeature?.id) {
        handleEditIntersections(draw, newFeature, terraDrawInstance, addNewZoneToMap);
    }
}

function handleEditIntersections(draw: MaplibreTerradrawControl, newFeature: GeoJSONStoreFeatures, terraDrawInstance: TerraDraw, addNewZoneToMap: (zone: CustomFeature, isUpdated?: boolean) => void) {
    const features = draw.getFeatures()?.features.filter((feature) => feature.id !== newFeature?.id);
    const intersectsWith = isIntersectingWithMapPolygon(newFeature, features);
    if (intersectsWith.length <= 0)
        return;

    intersectsWith.forEach(featureIntersected => {
        const newIntersectedFeatured = reDrawPolygonEditWithNoIntersection(featureIntersected, [newFeature]);
        if (featureIntersected?.id) {
            featureIntersected.geometry.coordinates = newIntersectedFeatured.geometry.coordinates as Position[][];
            terraDrawInstance.removeFeatures([featureIntersected.id]);
            addNewZoneToMap(featureIntersected as CustomFeature, true);
        }
    });


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
    terraDrawInstance: TerraDraw,
    draw: MaplibreTerradrawControl,
    setMode: (mode: DrawingModes) => void,
    setZones: React.Dispatch<React.SetStateAction<CustomFeature[]>>,
    addNewZoneToMap: (zone: CustomFeature) => void
) {
    let intersectsWithMapPolygon = false;

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

    const intersectsWith = isIntersectingWithMapPolygon(newFeature, features);
    try {

        if (intersectsWith.length > 0) {
            intersectsWithMapPolygon = true;
            const newPolygon = reDrawPolygonWithNoIntersection(newFeature, intersectsWith);
            if (newPolygon !== null) {
                newFeature.geometry.coordinates = newPolygon.geometry.coordinates as Position[][];
            }
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

    const newZoneInfo =  JSON.parse(localStorage.getItem("newSubZone") as string) ;
    console.log(localStorage.getItem("newSubZone"));
    localStorage.removeItem("newSubZone")
    console.log(newZoneInfo)
    

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
        return {
            "coords": polygon.geometry.coordinates as Position[][],
            "id": polygon.id

        }
    });



    const polygon = turf.polygon(polygonCoords);
    const otherPolygons = otherPolygonCoords.map((coords) => {
        return turf.polygon(coords.coords, { id: coords.id });
    });
    const intersectsWith: GeoJSONStoreFeatures[] = [];

    while (otherPolygons.length > 0) {
        const otherPolygon = otherPolygons.pop();
        if (!otherPolygon) continue;


        const intersectionResult = turf.intersect(turf.featureCollection([polygon, otherPolygon]));
        if (intersectionResult) {
            const intersectedPolygon: GeoJSONStoreFeatures = {
                id: otherPolygon.properties.id,
                type: "Feature",
                geometry: {
                    type: "Polygon",
                    coordinates: otherPolygon.geometry.coordinates as Position[][],
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



export { isSelfIntersectingPolygon, isIntersectingWithMapPolygon, handleFinish };
