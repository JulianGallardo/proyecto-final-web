import { toast } from "@/hooks/use-toast";
import { CustomFeature, DrawingModes, FeatureId, Position } from "@/types/MapTypes";
import * as turf from "@turf/turf";
import { GeoJSONStoreFeatures } from "terra-draw";
import { getZoneInfoFromLocalStorage } from "./localStorageUtils";
import { MaplibreTerradrawControl } from "@watergis/maplibre-gl-terradraw";


function getFeatureById(draw: MaplibreTerradrawControl, id: string) {
    return draw.getFeatures()?.features?.find((feature: GeoJSON.Feature) => feature.id === id);
}

function handleFinish(
    id: FeatureId,
    context: { action: string, mode: string },
    draw: MaplibreTerradrawControl,
    addNewZoneToMap: (zone: CustomFeature) => void,
    setMode: (mode: DrawingModes) => void,
    replaceZone: (zone: CustomFeature) => void

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

        draw.getFeatures().features.forEach((featureInMap: GeoJSONStoreFeatures) => {
            if (featureInMap.id !== newFeature.id) {
                if (isIntersectingWithMapPolygon(newFeature, featureInMap)) {
                    intersectsWithMapPolygon = true;

                    const changedPolygon = reDrawPolygonWithNoIntersection(newFeature, featureInMap);
                    if (changedPolygon !== null) {
                        newFeature.geometry.coordinates = changedPolygon.geometry.coordinates as Position[][];
                    }
                }
            }
        }
        );

        const newZoneInfo = getZoneInfoFromLocalStorage();

        newFeature.properties.color = newZoneInfo.color;
        newFeature.properties.editable = false;
        newFeature.properties.name = newZoneInfo.name;


        if (intersectsWithMapPolygon) {
            terraDrawInstance.removeFeatures([newFeature.id]);
            addNewZoneToMap(newFeature as CustomFeature);
        }

        replaceZone(newFeature as CustomFeature);
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
    polygonInMap: GeoJSONStoreFeatures
): boolean {
    const polygonCoords: Position[][] = polygonToDraw.geometry.coordinates as Position[][];
    const otherPolygonCoords = polygonInMap.geometry.coordinates as Position[][];

    const polygon = turf.polygon(polygonCoords);
    const otherPolygon = turf.polygon(otherPolygonCoords);

    const FeatureCollection = turf.featureCollection([polygon, otherPolygon]);
    // Verificar intersección
    const intersection = turf.intersect(FeatureCollection);
    if (intersection) {
        console.log('Los polígonos se intersectan:', intersection);
        return true;
    } else {
        console.log('No hay intersección');
        return false;
    }
}


function reDrawPolygonWithNoIntersection(
    polygonToDraw: GeoJSONStoreFeatures,
    polygonInMap: GeoJSONStoreFeatures
) {
    const polygonCoords: Position[][] = polygonToDraw.geometry.coordinates as Position[][];
    const otherPolygonCoords = polygonInMap.geometry.coordinates as Position[][];

    const polygon = turf.polygon(polygonCoords);
    const otherPolygon = turf.polygon(otherPolygonCoords);

    const FeatureCollection = turf.featureCollection([polygon, otherPolygon]);

    // Verificar intersección
    const intersection = turf.intersect(FeatureCollection);

    if (intersection) {
        // Recalcular polígono
        const difference = turf.difference(FeatureCollection);
        //ajustamos la precision de las coordenadas

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

        return difference;
    } else {
        return polygon;
    }
}


export { isSelfIntersectingPolygon, isIntersectingWithMapPolygon, reDrawPolygonWithNoIntersection, handleFinish };
