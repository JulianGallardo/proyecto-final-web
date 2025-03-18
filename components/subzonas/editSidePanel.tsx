import { useEffect, useState } from "react";
import { LoadSkeleton } from "../areas/maps/map";
import { Separator } from "../ui/separator";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarTrigger, useSidebar } from "../ui/sidebar";
import { ExtendedZone } from "@/types/ZoneTypes";
import { SadCircle, Plus, Trash } from "@mynaui/icons-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Edit2 } from "lucide-react";
import { MaplibreTerradrawControl } from "@watergis/maplibre-gl-terradraw";
import { DrawingModesSubZonas, FeatureId, OnFinishContext } from "@/types/MapTypes";
import { useSubZones } from "@/hooks/useSubZones";
import { handleFinishSubzones } from "@/lib/subZoneUtils/subZoneUtils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip";
import { ConfirmDelete } from "../areas/ui/Dialogs/ConfirmDelete";
import { ColorCache } from "@/lib/mapUtils/colorCache";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMap } from "@vis.gl/react-maplibre";
import SubZoneList from "./Control Panel/subZoneList";
import SubZonePanelHeader from "./Control Panel/subZonePanelHeader";

interface EditSidePanelSubzonesProps {
    zone: ExtendedZone;
    colorCache: ColorCache;
    draw: MaplibreTerradrawControl;
    exitEditMode: () => void;
}

export default function EditSidePanelSubzones(
    {
        zone,
        draw,
        colorCache,
        exitEditMode
    }: Readonly<EditSidePanelSubzonesProps>
) {

    const [mode, setMode] = useState<DrawingModesSubZonas>(DrawingModesSubZonas.SinSeleccionar);
    const [transactionLoading, setTransactionLoading] = useState(false);
    const [selectedSubzone, setSelectedSubzone] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
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



            handleFinishSubzones(parseId, context, draw, addNewSubZoneToMap, setMode, setSubZones, zone);
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

    const handleDeleteSubzone = (id: string) => {
        const subzone = subZones.find((subzona) => subzona.id === id);
        if (!subzone) return;

        const terraDrawInstance = draw.getTerraDrawInstance();
        terraDrawInstance.setMode("render");
        terraDrawInstance.removeFeatures([id]);
        setSubZones(subZones.filter((subzona) => subzona.id !== id));
    };

    const handleSubzoneClick = (id: string) => {
        setSelectedSubzone(id === selectedSubzone ? null : id);
    };

    const confirmDeleteSubzone = (id: string) => {
        console.log("confirmDeleteSubzone -> id", id);
        console.log(draw.getFeatures());
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
                {transactionLoading && <LoadSkeleton />}

                <Sidebar title="Panel de control" description="Panel de control de las subzonas en un área." >
                    <SidebarHeader>
                       
                        <SubZonePanelHeader
                            addSubZone={handleAddSubzone}

                            onEdit={}


                            discardChanges={() => setMode(DrawingModesSubZonas.SinSeleccionar)}
                            discardSubZoneEdits={() => setMode(DrawingModesSubZonas.SinSeleccionar)}
                            saveChanges={() => setMode(DrawingModesSubZonas.SinSeleccionar)}
                            saveSubZoneEdits={() => setMode(DrawingModesSubZonas.SinSeleccionar)}
                            setRenderMode={() => setMode(DrawingModesSubZonas.SinSeleccionar)}




                            mode={mode}
                            subZones={subZones}
                            zone={zone}
                        />


                    </SidebarHeader>

                    <Separator className="my-4" />

                    <SidebarContent className="flex flex-col gap-4 w-full p-4">
                        

                        <ScrollArea className="h-[calc(100vh-220px)]">
                            <SubZoneList
                                confirmDeleteSubzone={confirmDeleteSubzone}
                                handleAddSubzone={handleAddSubzone}
                                handleEditSubzone={handleEditSubzone}
                                handleSubzoneClick={handleSubzoneClick}
                                selectedSubzone={selectedSubzone}
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