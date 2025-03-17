import { CustomFeature } from "@/types/MapTypes";
import { MaplibreTerradrawControl } from "@watergis/maplibre-gl-terradraw";
import { useState } from "react";
import { GeoJSONStoreFeatures } from "terra-draw";
import { toast } from "./use-toast";
import { ExtendedZone } from "@/types/ZoneTypes";
import { ColorCache } from "@/lib/mapUtils/colorCache";

export function useSubZones(
    terraDrawControl: MaplibreTerradrawControl,
    colorCache: ColorCache,
    zone: ExtendedZone
) {
    const [subZones, setSubZones] = useState<CustomFeature[]>([]); // Estado de zonas
    const terraDrawInstance = terraDrawControl.getTerraDrawInstance();
    async function fetchSubZones() {
        const subZones = zone.SubZonas;
        subZones.sort((a, b) => {
            // Check if both names start with numbers
            const aIsNumeric = /^\d/.test(a.zoneName);
            const bIsNumeric = /^\d/.test(b.zoneName);
    
            // If one starts with a number and the other doesn't
            if (aIsNumeric && !bIsNumeric) {
                return -1; // Numbers come before letters
            } else if (!aIsNumeric && bIsNumeric) {
                return 1; // Letters come after numbers
            }
    
            // If both start with numbers, sort numerically in descending order
            if (aIsNumeric && bIsNumeric) {
                // Extract the numeric parts
                const aMatch = /^\d+/.exec(a.zoneName);
                const aNum = aMatch ? parseInt(aMatch[0]) : 0;
                const bMatch = b.zoneName.match(/^\d+/);
                const bNum = bMatch ? parseInt(bMatch[0]) : 0;
                return bNum - aNum; // Descending order for numbers
            }
    
            // If both are alphabetic, sort alphabetically
            return a.zoneName.localeCompare(b.zoneName);
        });
    
        const subZonesCustomFeatures: CustomFeature[] = subZones.map((subZone) => {
            // Crear un array de coordenadas redondeadas a 9 decimales
            const roundedCoordinates = subZone.geometry.coordinates.map(coord => [
                parseFloat(coord.latitude.toFixed(9)),
                parseFloat(coord.longitude.toFixed(9))
            ]);
    
            const zoneToCustomFeature = {
                id: subZone.id,
                type: "Feature",
                geometry: {
                    type: "Polygon",
                    coordinates: [roundedCoordinates]
                },
                properties: {
                    mode: "polygon",
                    color: zone.zoneColor,
                    name: subZone.zoneName,
                },
            } as CustomFeature;
    
            return zoneToCustomFeature;
        });

        subZonesCustomFeatures.forEach((zone) => {
            addNewSubZoneToMap(zone);
        });
        
        setSubZones(subZonesCustomFeatures);


        
        return subZonesCustomFeatures;
    }

    function addNewSubZoneToMap(subZone: CustomFeature) {
        // Check if the polygon is already closed
        const coordinates = subZone.geometry.coordinates;




        // In GeoJSON, polygon coordinates are typically arrays of arrays
        // The outer ring should be the first element
        let polygonCoordinates: any[];

        // Handle both single array of coordinates and nested arrays (GeoJSON standard)
        if (Array.isArray(coordinates[0]) && Array.isArray(coordinates[0][0])) {
            // This is already in GeoJSON format [[...coordinates...]]
            polygonCoordinates = coordinates;

            // Check if the first ring is closed
            const firstRing = polygonCoordinates[0];
            const firstPoint = firstRing[0];
            const lastPoint = firstRing[firstRing.length - 1];

            // If not closed, close it
            if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
                polygonCoordinates[0] = [...firstRing, firstRing[0]];
            }
        } else {
            // This is a flat array of coordinates, needs to be nested
            // Check if it's closed
            const firstPoint = coordinates[0];
            const lastPoint = coordinates[coordinates.length - 1];

            const isClosed = (
                Array.isArray(firstPoint) && Array.isArray(lastPoint) &&
                firstPoint[0] === lastPoint[0] &&
                firstPoint[1] === lastPoint[1]
            );

            // Create a properly closed polygon
            polygonCoordinates = [
                isClosed ? coordinates : [...coordinates, coordinates[0]]
            ];
        }

        const newZone = {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: polygonCoordinates
            },
            properties: {
                mode: "polygon",
                color: subZone.properties.color,
                name: subZone.properties.name
            },
        } as GeoJSONStoreFeatures;

        colorCache.saveDataToColorCache(`"${zone.id}"`, subZone.properties.color);
        terraDrawInstance.addFeatures([newZone]);
    }

    function deleteSubZone(featureToDelete: CustomFeature) {
        try {
            const updatedZones = subZones.filter((zone) => zone.id !== featureToDelete.id);
            setSubZones(updatedZones);

            if (featureToDelete.id) {
                terraDrawInstance.removeFeatures([featureToDelete.id]);
                colorCache.deleteDataInColorCache(`"${zone.id}"`);
            }
        } catch (error) {
            if (error instanceof Error) {
                toast({
                    title: "Error",
                    description: error.message,
                    className: "bg-red-500 text-white",
                    duration: 3000,
                });
            }
        }


    }

    return {
        subZones,
        setSubZones,
        addNewSubZoneToMap,
        fetchSubZones,
        deleteSubZone,

    };


}