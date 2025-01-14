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
        zones.forEach((zone) => {
            addNewZoneToMap(zone);

        });
        setZones(zones);
    }

    function addNewZoneToMap(zone: CustomFeature, isUpdate = false) {
        const newZone = {
            id: zone.id,
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: zone.geometry.coordinates
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
        terraDrawInstance.addFeatures([newZone]);

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