import { Position } from "@/types/MapTypes";
import * as turf from "@turf/turf";
import { FeatureCollection } from "geojson";
import { Feature } from "maplibre-gl";
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
    const otherPolygonCoords =polygonInMap.geometry.coordinates as Position[][];

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






export { isSelfIntersectingPolygon, isIntersectingWithMapPolygon };
