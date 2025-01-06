import { MaplibreTerradrawControl } from "@watergis/maplibre-gl-terradraw";
import { eraseZoneInfoFromLocalStorage } from "./localStorageUtils";
import { createNewZones } from "@/actions/zone-actions";
import { toast } from "@/hooks/use-toast";
import { CustomFeature, DrawingModes } from "@/types/MapTypes";
import { GeoJSONStoreFeatures } from "terra-draw";
import { ColorCache } from "./colorCache";



function setRenderModeHelper(
    draw: MaplibreTerradrawControl,
    setMode: React.Dispatch<React.SetStateAction<DrawingModes>>
) {
    const terraDrawInstance = draw?.getTerraDrawInstance();
    const zones = JSON.parse(window.localStorage.getItem("zones") ?? "[]");
    if (zones.length > 0) {
        eraseZoneInfoFromLocalStorage();
    }
    terraDrawInstance?.setMode("render");
    setMode(DrawingModes.SinSeleccionar);

}

function addZoneHelper(
    draw: MaplibreTerradrawControl,
    setNewZoneDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setMode: React.Dispatch<React.SetStateAction<DrawingModes>>,
) {
    const terraDrawInstance = draw.getTerraDrawInstance();

    setNewZoneDialogOpen(true);
    terraDrawInstance?.setMode("polygon");
    setMode(DrawingModes.CreandoZonas);
};

function editZoneHelper(
    draw: MaplibreTerradrawControl,
    setMode: React.Dispatch<React.SetStateAction<DrawingModes>>,
    isMobile: boolean,
    setOpenMobile: (open: boolean) => void,
) {
    const terraDrawInstance = draw.getTerraDrawInstance();
    terraDrawInstance?.setMode("select");
    setMode(DrawingModes.EditandoZonas);

    if (isMobile) {
        setOpenMobile(false);
    }

};

function discardZoneEditsHelper(
    draw: MaplibreTerradrawControl,
    zones: CustomFeature[],
    setMode: React.Dispatch<React.SetStateAction<DrawingModes>>,
    addNewZoneToMap: (zone: CustomFeature) => void,
) {
    const terraDrawInstance = draw.getTerraDrawInstance();
    zones.forEach((zone) => {
        if (zone.id) {
            terraDrawInstance?.removeFeatures([zone.id]);
        }
    });

    zones.forEach((zone) => {
        addNewZoneToMap(zone);
    });


    terraDrawInstance?.setMode("render");
    setMode(DrawingModes.SinSeleccionar);
};

function saveEditsHelper(
    draw: MaplibreTerradrawControl,
    zones: CustomFeature[],
    setZones: React.Dispatch<React.SetStateAction<CustomFeature[]>>,
    setMode: React.Dispatch<React.SetStateAction<DrawingModes>>,
) {
    const terraDrawInstance = draw.getTerraDrawInstance();
    terraDrawInstance?.setMode("render");

    draw.getFeatures()?.features.forEach((feature: GeoJSONStoreFeatures) => {
        const zone = zones.find((zone) => zone.id === feature.id);
        if (zone) {
            zone.geometry.coordinates = feature.geometry.coordinates;
        }
        setZones([...zones]);
    });
    setMode(DrawingModes.SinSeleccionar);
};

async function saveChangesHelper(
    setTransactionLoading: React.Dispatch<React.SetStateAction<boolean>>,
    isMobile: boolean,
    setOpenMobile: (open: boolean) => void,
    zones: CustomFeature[],
    changeEditingState: (state: boolean) => void,
    setMode: React.Dispatch<React.SetStateAction<DrawingModes>>,

) {
    setTransactionLoading(true);
    if (isMobile) {
        setOpenMobile(false);
    }

    const zoneNames = zones.map(zone => zone.properties.name);
    if (zoneNames.length !== new Set(zoneNames).size) {
        toast({
            title: "Error",
            description: "No pueden haber zonas con el mismo nombre, por favor cambie los nombres de las zonas repetidas",
            className: "bg-red-500 text-white",
            duration: 3000,
        });
        setTransactionLoading(false);
        if (isMobile) {
            setOpenMobile(true);
        }
        return;
    }

    changeEditingState(false);
    setMode(DrawingModes.SinSeleccionar);

    try {
        const response = await createNewZones(zones);
        setTransactionLoading(false);
        if (isMobile) {
            setOpenMobile(true);
        }
        if (response.status === "success") {
            toast({
                title: "Zonas guardadas",
                description: "Las zonas han sido guardadas exitosamente",
                className: "bg-green-500 text-white",
                duration: 2000,
            });
        } else {
            toast({
                title: "Error",
                description: response.message || "Ha ocurrido un error al guardar las zonas",
                className: "bg-red-500 text-white",
                duration: 2000,
            });
        }
    } catch (error) {
        setTransactionLoading(false);
        if (isMobile) {
            setOpenMobile(true);
        }
        const errorMessage =
            error instanceof Error
                ? `Ha ocurrido un error al guardar las zonas: ${error.message}`
                : "Ha ocurrido un error desconocido al guardar las zonas";

        toast({
            title: "Error",
            description: errorMessage,
            className: "bg-red-500 text-white",
            duration: 2000,
        });
    }
};

async function discardChangesHelper(
    zones: CustomFeature[],
    draw: MaplibreTerradrawControl,
    colorCache: ColorCache,
    setZones: React.Dispatch<React.SetStateAction<CustomFeature[]>>,
    setMode: React.Dispatch<React.SetStateAction<DrawingModes>>,
    changeEditingState: (state: boolean) => void,
    fetchZones: () => Promise<void>,
    
) {
    

    const terraDrawInstance = draw.getTerraDrawInstance();
    terraDrawInstance?.setMode("render");

    zones.forEach((zone) => {
        if (zone.id) {
            terraDrawInstance?.removeFeatures([zone.id]);
            colorCache.deleteDataInColorCache(`"${zone.id}"`);
        }
    });
    setZones([]);
    fetchZones().then(() => {
        setMode(DrawingModes.SinSeleccionar);
        toast({
            title: "Cambios descartados",
            description: "Los cambios han sido descartados exitosamente",
            className: "bg-green-500 text-white",
            duration: 2000,
        });

        changeEditingState(false);
        

    }).catch((error) => {
        throw new Error(error);
    });

}

export {
    setRenderModeHelper,
    addZoneHelper,
    editZoneHelper,
    discardZoneEditsHelper,
    saveEditsHelper,
    saveChangesHelper,
    discardChangesHelper
}
