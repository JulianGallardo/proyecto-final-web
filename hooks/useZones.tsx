import { getAllZones } from "@/actions/zone-actions";
import { useSidebar } from "@/components/ui/sidebar";
import { ColorCache } from "@/lib/mapUtils/colorCache";
import { CustomFeature } from "@/types/MapTypes";
import { MaplibreTerradrawControl } from "@watergis/maplibre-gl-terradraw";
import { useState } from "react";
import { GeoJSONStoreFeatures } from "terra-draw";

export function useZones(
    terraDrawControl: MaplibreTerradrawControl,
    colorCache: ColorCache) {
    const [zones, setZones] = useState<CustomFeature[]>([]); // Estado de zonas
    const terraDrawInstance = terraDrawControl.getTerraDrawInstance();
    const { isMobile, setOpenMobile } = useSidebar();

    async function fetchZones() {
        const zones = await getAllZones();
        zones.forEach((zone) => {
            addNewZoneToMap(zone);

        });
        setZones(zones);
    }

    function addNewZoneToMap(zone: CustomFeature) {
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

        colorCache.saveDataToColorCache(`"${zone.id}"`, zone.properties.color);
        terraDrawInstance.addFeatures([newZone]);

    }


    function deleteZone(featureToDelete: CustomFeature) {

        const updatedZones = zones.filter((zone) => zone.id !== featureToDelete.id);
        setZones(updatedZones);

        if (featureToDelete.id) {
            terraDrawInstance.removeFeatures([featureToDelete.id]);
            colorCache.deleteDataInColorCache(`"${featureToDelete.id}"`);
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