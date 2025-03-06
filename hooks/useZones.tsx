import { getAllZones } from "@/actions/zone-actions";
import { ColorCache } from "@/lib/mapUtils/colorCache";
import { CustomFeature } from "@/types/MapTypes";
import { MaplibreTerradrawControl } from "@watergis/maplibre-gl-terradraw";
import { useState } from "react";
import { GeoJSONStoreFeatures } from "terra-draw";
import { toast } from "./use-toast";

export function useZones(
    terraDrawControl: MaplibreTerradrawControl,
    colorCache: ColorCache) {
    const [zones, setZones] = useState<CustomFeature[]>([]); // Estado de zonas
    const terraDrawInstance = terraDrawControl.getTerraDrawInstance();
    async function fetchZones() {
        const zones = await getAllZones();
        zones.sort((a, b) => {
            // Check if both names start with numbers
            const aIsNumeric = /^\d/.test(a.properties.name);
            const bIsNumeric = /^\d/.test(b.properties.name);

            // If one starts with a number and the other doesn't
            if (aIsNumeric && !bIsNumeric) {
                return -1; // Numbers come before letters
            } else if (!aIsNumeric && bIsNumeric) {
                return 1; // Letters come after numbers
            }

            // If both start with numbers, sort numerically in descending order
            if (aIsNumeric && bIsNumeric) {
                // Extract the numeric parts
                const aMatch = /^\d+/.exec(a.properties.name);
                const aNum = aMatch ? parseInt(aMatch[0]) : 0;
                const bMatch = b.properties.name.match(/^\d+/);
                const bNum = bMatch ? parseInt(bMatch[0]) : 0;
                return bNum - aNum; // Descending order for numbers
            }

            // If both are alphabetic, sort alphabetically
            return a.properties.name.localeCompare(b.properties.name);
        });
        zones.forEach((zone) => {
            addNewZoneToMap(zone);

        });
        setZones(zones);
    }

    function addNewZoneToMap(zone: CustomFeature, isUpdate = false) {
        // Check if the polygon is already closed
        const coordinates = zone.geometry.coordinates;
        
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
            id: zone.id,
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: polygonCoordinates
            },
            properties: {
                mode: "polygon",
                color: zone.properties.color,
                name: zone.properties.name
            },
        } as GeoJSONStoreFeatures;
    
    
        if (!isUpdate) {
            colorCache.saveDataToColorCache(`"${zone.id}"`, zone.properties.color);
        }
    }

    function deleteZone(featureToDelete: CustomFeature) {
        try {
            const updatedZones = zones.filter((zone) => zone.id !== featureToDelete.id);
            setZones(updatedZones);

            if (featureToDelete.id) {
                terraDrawInstance.removeFeatures([featureToDelete.id]);
                colorCache.deleteDataInColorCache(`"${featureToDelete.id}"`);
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
        zones,
        setZones,
        addNewZoneToMap,
        fetchZones,
        deleteZone,

    };


}