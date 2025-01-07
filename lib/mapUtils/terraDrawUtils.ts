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
            polygon.geometry.coordinates = difference.geometry.coordinates;
        }
        else console.warn("No se pudo limpiar la intersección");
    });

    console.log("Polygon sin intersecciones:", polygon);



    //redondeo las coordenadas
    const roundedPolygon = redondearCoordenadas(polygon);
    const picos = detectarPicos(roundedPolygon[0]);
    console.log("Picos:", picos);

    const newPolygonCoords = eliminarPicos(polygon, picos);
    polygon.geometry.coordinates = [newPolygonCoords];


    console.log("Polygon sin picos:", polygon);

    




    return turf.truncate(polygon, { precision: 9 });;

}


function calcularAngulo(p1: Position, p2: Position, p3: Position): number {
    // Vectores: p1->p2 y p2->p3
    const v1: Position = [p2[0] - p1[0], p2[1] - p1[1]];
    const v2: Position = [p3[0] - p2[0], p3[1] - p2[1]];

    // Producto punto de los vectores
    const productoPunto = v1[0] * v2[0] + v1[1] * v2[1];

    // Magnitudes de los vectores
    const magnitudV1 = Math.sqrt(v1[0] ** 2 + v1[1] ** 2);
    const magnitudV2 = Math.sqrt(v2[0] ** 2 + v2[1] ** 2);

    // Cálculo del coseno del ángulo entre los vectores
    const cosAngulo = productoPunto / (magnitudV1 * magnitudV2);

    // Asegurarse de que el valor esté en el rango [-1, 1] para evitar errores de precisión
    const cosAnguloAjustado = Math.max(-1, Math.min(1, cosAngulo));

    // Ángulo en radianes, luego convertirlo a grados
    const angulo = Math.acos(cosAnguloAjustado) * (180 / Math.PI);
    return angulo;
}

// Función para eliminar picos del polígono
function detectarPicos(puntos: Position[], umbralAngulo: number = 30): Position[] {
    const puntosFiltrados: Position[] = [];
    const n = puntos.length;

    for (let i = 0; i < n; i++) {
        // Calcular los puntos anterior y siguiente de manera circular
        let p1 = puntos[(i - 1 + n) % n]; // Punto anterior (circular)
        const p2 = puntos[i]; // Punto actual
        let p3 = puntos[(i + 1) % n]; // Punto siguiente (circular)

        if (p1[0] === p2[0] && p1[1] === p2[1]) {
            p1 = puntos[(i - 2 + n) % n];
        }
        if (p2[0] === p3[0] && p2[1] === p3[1]) {
            p3 = puntos[(i + 2) % n];
        }


        const angulo = calcularAngulo(p1, p2, p3);
        console.log("Ángulo entre", p1, p2, p3, "es:", angulo);

        // Si el ángulo es menor que el umbral o es NaN, consideramos este punto como pico
        if (angulo < umbralAngulo || angulo >= 179) {
            puntosFiltrados.push(p2);
        }
    }

    return puntosFiltrados;
}




function eliminarPicos(polygon: Feature<Polygon, GeoJsonProperties>, points: Position[]) {
    const polygonPoints = turf.explode(polygon);
    const polygonPointsCoords = polygonPoints.features.map((feature) => feature.geometry.coordinates as Position);

    // Filtramos los puntos que no son picos
    const filteredPoints = polygonPointsCoords.filter((point) => {
        const roundedPoint = [turf.round(point[0], 9), turf.round(point[1], 9)];
        const includes = points.some((p) => p[0] === roundedPoint[0] && p[1] === roundedPoint[1]);
        console.log("Punto:", roundedPoint, "es pico?", includes);
        return !includes;
    }
    );

    //chequeamos que el primer punto y el ultimo sean iguales
    if (filteredPoints[0][0] !== filteredPoints[filteredPoints.length - 1][0] || filteredPoints[0][1] !== filteredPoints[filteredPoints.length - 1][1]) {
        filteredPoints.push(filteredPoints[0]);
    }

    return filteredPoints;
}


function redondearCoordenadas(polygon: Feature<Polygon, GeoJsonProperties>): Position[][] {
    const polygonCoords = polygon.geometry.coordinates as Position[][];
    const roundedCoords = polygonCoords.map((coords) => {
        return coords.map((coord) => {
            return [turf.round(coord[0], 9), turf.round(coord[1], 9)];
        });
    });

    return roundedCoords as Position[][];
}


export { isSelfIntersectingPolygon, isIntersectingWithMapPolygon, reDrawPolygonWithNoIntersection, handleFinish };
