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
import { DrawingModes, FeatureId, OnFinishContext } from "@/types/MapTypes";
import { useSubZones } from "@/hooks/useSubZones";
import { handleFinish } from "@/lib/subZoneUtils/subZoneUtils";
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

    const [mode, setMode] = useState<DrawingModes>(DrawingModes.SinSeleccionar);
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



            handleFinish(parseId, context, draw, addNewSubZoneToMap, setMode, setSubZones, zone);
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
        setMode(DrawingModes.CreandoZonas);

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
        setMode(DrawingModes.EditandoZonas);
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
                        <div className="flex flex-col items-start w-full p-2">
                            <div className="flex items-center justify-between w-full">
                                <h1 className="text-xl font-bold">Subzonas</h1>
                                <Badge variant="outline" className="bg-gray-100">
                                    {zone.SubZonas.length}
                                </Badge>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                Gestiona las subzonas de la zona <span className="font-medium">{zone.zoneName}</span>
                            </p>
                        </div>
                    </SidebarHeader>

                    <Separator className="my-4" />

                    <SidebarContent className="flex flex-col gap-4 w-full p-2">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-sm font-semibold text-gray-700">Todas las subzonas</h2>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="sm"
                                            className="flex items-center gap-1 bg-green-500 hover:bg-green-800 text-white"
                                            onClick={handleAddSubzone}
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Añadir</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Crear nueva subzona</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        <ScrollArea className="h-[calc(100vh-220px)] pr-2">
                            {subZones.length > 0 ? (
                                <div className="flex flex-col gap-2">
                                    {subZones.filter(subzona => subzona.id !== undefined).map((subzona) => {
                                        // Asegurarnos de que id no es undefined ni null
                                        const subzonaId = String(subzona.id || '');

                                        return subzonaId && (
                                            <Card
                                                key={subzonaId}
                                                className={`p-3 cursor-pointer border transition-all ${selectedSubzone === subzonaId
                                                    ? "border-primary shadow-sm"
                                                    : "hover:bg-gray-50"
                                                    } flex flex-col gap-3 shadow-lg border-gray-200 rounded-lg bg-gradient-to-r from-white to-gray-50 hover:shadow-xl transition-shadow`}
                                                onClick={() => handleSubzoneClick(subzonaId)}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-6 h-6 rounded-full border border-gray-300"
                                                            style={{ backgroundColor: zone.zoneColor }}
                                                        />
                                                        <p className="font-bold text-sm md:text-md truncate">{subzona.properties.name}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-8 w-8 p-0 bg-yellow-500 hover:bg-yellow-800 text-white"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleEditSubzone(subzonaId);
                                                                        }}
                                                                    >
                                                                        <Edit2 className="w-4 h-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="top">
                                                                    <p>Editar subzona</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>

                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-8 w-8 p-0 bg-red-500 hover:bg-red-800 text-white"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            confirmDeleteSubzone(subzonaId);
                                                                        }}
                                                                    >
                                                                        <Trash className="w-4 h-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="top">
                                                                    <p>Eliminar subzona</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                </div>

                                                {selectedSubzone === subzonaId && (
                                                    <div className="mt-2 pt-2 border-t text-sm text-gray-500">
                                                        <p className="mb-1">ID: <span className="font-mono text-xs">{subzonaId}</span></p>
                                                        <p>Área: {subzona.properties.name || "No especificada"} m²</p>
                                                    </div>
                                                )}
                                            </Card>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <SadCircle className="w-10 h-10 text-gray-400 mb-3" />
                                    <p className="text-gray-500 mb-2">No hay subzonas en esta área</p>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    onClick={handleAddSubzone}
                                                    className="mt-2 bg-green-500 hover:bg-green-800 text-white"
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Crear primera subzona
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Crear nueva subzona</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            )}
                        </ScrollArea>
                    </SidebarContent>
                    <SidebarFooter>
                        <Button
                            size="sm"
                            className="w-full bg-blue-500 hover:bg-blue-800 text-white"
                            onClick={() => exitEditMode()}
                        >
                            Salir
                        </Button>
                    </SidebarFooter>
                </Sidebar>

                <SidebarTrigger className="flex items-center justify-center h-full bg-white" />
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