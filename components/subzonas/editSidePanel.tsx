import { useEffect, useState } from "react";
import { Separator } from "../ui/separator";
import { Sidebar, SidebarContent, SidebarHeader, SidebarTrigger, useSidebar } from "../ui/sidebar";
import { ExtendedZone } from "@/types/ZoneTypes";
import { ScrollArea } from "../ui/scroll-area";
import { MaplibreTerradrawControl } from "@watergis/maplibre-gl-terradraw";
import { DrawingModesSubZonas, FeatureId, OnFinishContext } from "@/types/MapTypes";
import { useSubZones } from "@/hooks/useSubZones";
import { handleFinishSubzones } from "@/lib/subZoneUtils/subZoneUtils";

import { ConfirmDelete } from "../areas/ui/Dialogs/ConfirmDelete";
import { ColorCache } from "@/lib/mapUtils/colorCache";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMap } from "@vis.gl/react-maplibre";
import SubZoneList from "./Control Panel/subZoneList";
import SubZonePanelHeader from "./Control Panel/subZonePanelHeader";
import { GeoJSONStoreFeatures } from "terra-draw";
import { createSubZones } from "@/actions/zone-actions";
import { toast } from "@/hooks/use-toast";

interface EditSidePanelSubzonesProps {
    zone: ExtendedZone;
    colorCache: ColorCache;
    draw: MaplibreTerradrawControl;
    exitEditMode: () => void;
    setLoading: (loading: boolean) => void;
}

export default function EditSidePanelSubzones(
    {
        zone,
        draw,
        colorCache,
        exitEditMode,
        setLoading
    }: Readonly<EditSidePanelSubzonesProps>
) {

    const [editing, setEditing] = useState(false);
    const [mode, setMode] = useState<DrawingModesSubZonas>(DrawingModesSubZonas.SinSeleccionar);
    const [openDelete, setOpenDelete] = useState(false);
    const [subzoneToDelete, setSubzoneToDelete] = useState<string | null>(null);
    const { setOpen } = useSidebar();
    const isMobile = useIsMobile();
    const { mymap } = useMap();


    const {
        subZones,
        setSubZones,
        fetchSubZones,
        addNewSubZoneToMap,
    } = useSubZones(draw, colorCache, zone);

    function calculateNewSubzoneName() {
        const lastSubzone = subZones[subZones.length - 1];
        if (!lastSubzone) return `A`;
        const lastLetter = lastSubzone.properties.name.charCodeAt(0);
        return String.fromCharCode(lastLetter + 1);
    }



    useEffect(() => {
        fetchSubZones()
            .then(() => setLoading(false))
            .catch((error) => {
                throw new Error(error);
            });

        const terraDrawInstance = draw.getTerraDrawInstance();
        const callback = (id: FeatureId, context: OnFinishContext) => {
            const parseId = id as string;


            try {

                handleFinishSubzones(parseId, context, draw, addNewSubZoneToMap, setMode, setSubZones, zone);
            } catch (error) {
                toast({
                    title: "Error",
                    description: error instanceof Error ? error.message : "Ha ocurrido un error al finalizar la subzona",
                    className: "bg-red-500 text-white",
                    duration: 2000,
                });
            }
        };
        draw.getTerraDrawInstance().on("finish", callback);
        
        return () => {
            terraDrawInstance.off("finish", callback);
        };
    }, [draw]);

    useEffect(() => {
        if (mymap) {
            const mapInstance = mymap.getMap();
            mapInstance.getSource("subzones-edit-source")?.setData({
                type: "FeatureCollection",
                features: subZones
            });
        }
    }, [subZones, mymap]);



    const handleAddSubzone = () => {
        const terraDrawInstance = draw.getTerraDrawInstance();
        setMode(DrawingModesSubZonas.CreandoSubZonas);

        localStorage.setItem("newSubZone", JSON.stringify(
            {
                color: zone.zoneColor,
                name: calculateNewSubzoneName(),
            }));

        terraDrawInstance.setMode("polygon");
        if (isMobile) setOpen(false);
    };

    const handleEditSubzone = (id: string) => {
        const subzone = subZones.find((subzona) => subzona.id === id);
        if (!subzone) return;
        const terraDrawInstance = draw.getTerraDrawInstance();
        setMode(DrawingModesSubZonas.EditandoSubZonas);
        terraDrawInstance.selectFeature(id);
        if (isMobile) setOpen(false);
    };

    const handleEditSubZones = () => {
        const terraDrawInstance = draw.getTerraDrawInstance();
        setMode(DrawingModesSubZonas.EditandoSubZonas);
        terraDrawInstance.setMode("select");
        if (isMobile) setOpen(false);
    };

    const handleDeleteSubzone = (id: string) => {
        const subzone = subZones.find((subzona) => subzona.id === id);
        if (!subzone) return;

        const terraDrawInstance = draw.getTerraDrawInstance();
        terraDrawInstance.setMode("render");
        terraDrawInstance.removeFeatures([id]);
        setSubZones(subZones.filter((subzona) => subzona.id !== id));
    };


    const handleSaveSubZoneEdits = () => {
        setLoading(true);
        const terraDrawInstance = draw.getTerraDrawInstance();
        terraDrawInstance.setMode("render");
        draw.getFeatures()?.features.forEach((feature: GeoJSONStoreFeatures) => {
            const zone = subZones.find((zone) => zone.id === feature.id);
            if (zone) {
                zone.geometry.coordinates = feature.geometry.coordinates;
            }
            setSubZones([...subZones]);
        });
        setMode(DrawingModesSubZonas.SinSeleccionar);
        setLoading(false);
    }

    const handleDiscardSubZoneEdits = () => {
        const terraDrawInstance = draw.getTerraDrawInstance();

        subZones.forEach((subzona) => {
            if (subzona.id) {
                terraDrawInstance.removeFeatures([subzona.id]);
            }
        });
        subZones.forEach((subzona) => {
            addNewSubZoneToMap(subzona);
        });
        terraDrawInstance.setMode("render");
        setMode(DrawingModesSubZonas.SinSeleccionar);
    }

    const handleDiscardChanges = async () => {
        setLoading(true);
        const terraDrawInstance = draw.getTerraDrawInstance();
        subZones.forEach((subzona) => {
            if (subzona.id) {
                terraDrawInstance.removeFeatures([subzona.id]);
            }
        });
        await fetchSubZones();
        terraDrawInstance.setMode("render");
        setMode(DrawingModesSubZonas.SinSeleccionar);
        setEditing(false);
        setLoading(false);
    }

    const handleSaveChanges = async () => {
        setLoading(true);
        const terraDrawInstance = draw.getTerraDrawInstance();
        terraDrawInstance.setMode("render");



        try {
            const response = await createSubZones(zone.id, subZones);


            if (response.success) {
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

        setMode(DrawingModesSubZonas.SinSeleccionar);
        setEditing(false);
        setLoading(false);


    }

    const setRenderMode = () => {
        const terraDrawInstance = draw.getTerraDrawInstance();
        terraDrawInstance.setMode("render");
        setMode(DrawingModesSubZonas.SinSeleccionar);
    }


    const confirmDeleteSubzone = (id: string) => {
        setSubzoneToDelete(id);
        setOpenDelete(true);
    };

    const executeDelete = () => {
        if (subzoneToDelete) {
            handleDeleteSubzone(subzoneToDelete);
            setSubzoneToDelete(null);
        }
    };

    return (
        <div className="flex flex-row w-full h-full">
            <div className="w-full h-full flex flex-row">
               

                <Sidebar title="Panel de control" description="Panel de control de las subzonas en un área." >
                    <SidebarHeader>

                        <SubZonePanelHeader
                            addSubZone={handleAddSubzone}
                            editing={editing}
                            setEditing={setEditing}
                            onEdit={handleEditSubZones}
                            exitSubZoneView={exitEditMode}


                            discardChanges={handleDiscardChanges}
                            saveChanges={handleSaveChanges}
                            saveSubZoneEdits={handleSaveSubZoneEdits}
                            discardSubZoneEdits={handleDiscardSubZoneEdits}
                            setRenderMode={setRenderMode}





                            mode={mode}
                            subZones={subZones}
                            zone={zone}
                        />


                    </SidebarHeader>

                    <Separator className="my-4" />

                    <SidebarContent className="flex flex-col gap-4 w-full p-4">


                        <ScrollArea className="h-[calc(100vh-220px)]">
                            <SubZoneList
                                editing={editing}
                                confirmDeleteSubzone={confirmDeleteSubzone}
                                handleEditSubzone={handleEditSubzone}
                                subZones={subZones}
                                zone={zone}
                            />
                        </ScrollArea>
                    </SidebarContent>

                </Sidebar>

                <SidebarTrigger className="flex items-center justify-center h-full bg-white rounded-l-none" />
            </div>

            <ConfirmDelete
                title={`¿Estás seguro de borrar esta subzona?`}
                description="Esta acción no se puede deshacer."
                onConfirm={executeDelete}
                triggerText="Borrar"
                open={openDelete}
                setOpen={setOpenDelete}
            />
        </div>
    );
}