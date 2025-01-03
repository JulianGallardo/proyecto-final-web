import { Position } from "@/types/MapTypes";
import * as turf from "@turf/turf";
import { GeoJSONStoreFeatures } from "terra-draw";

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

        if (difference){
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
        console.log('No hay intersección');
        return polygon;
    }
}






export { isSelfIntersectingPolygon, isIntersectingWithMapPolygon, reDrawPolygonWithNoIntersection };
