import { useEffect, useState } from "react";
import { LoadSkeleton } from "../areas/maps/map";
import { Separator } from "../ui/separator";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarTrigger } from "../ui/sidebar";
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
import { handleFinish } from "@/lib/mapUtils/terraDrawUtils";

interface EditSidePanelSubzonesProps {
    zone: ExtendedZone;
    draw: MaplibreTerradrawControl;
    exitEditMode: () => void;
}

export default function EditSidePanelSubzones(
    {
        zone,
        draw,
        exitEditMode
    }: Readonly<EditSidePanelSubzonesProps>
) {

    const [mode, setMode] = useState<DrawingModes>(DrawingModes.SinSeleccionar);
    const [transactionLoading, setTransactionLoading] = useState(false);
    const [selectedSubzone, setSelectedSubzone] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const {
        subZones,
        setSubZones,
        fetchSubZones,
        addNewSubZoneToMap,

    } = useSubZones(draw, zone);




    useEffect(() => {

        fetchSubZones()
            .then(() => setLoading(false))
            .catch((error) => {
                throw new Error(error);
            });

        const terraDrawInstance = draw.getTerraDrawInstance();
        const callback = (id: FeatureId, context: OnFinishContext) => {
            const parseId = id as string;
            handleFinish(parseId, context, draw, addNewSubZoneToMap, setMode, setSubZones);
            
        };
        draw.getTerraDrawInstance().on("finish", callback);
        return () => {
            terraDrawInstance.off("finish", callback);
        };
    }, [draw]);


    const handleAddSubzone = () => {
        const terraDrawInstance = draw.getTerraDrawInstance();
        setMode(DrawingModes.CreandoZonas);
        terraDrawInstance.setMode(DrawingModes.CreandoZonas);

        

    };

    const handleEditSubzone = (id: string) => {
        // Implement edit subzone logic
        console.log("Edit subzone", id);
    };

    const handleDeleteSubzone = (id: string) => {
        // Implement delete subzone logic
        console.log("Delete subzone", id);
    };

    const handleSubzoneClick = (id: string) => {
        setSelectedSubzone(id === selectedSubzone ? null : id);
    };

    return (
        <div className="flex flex-row w-full h-full">
            <div className="w-full h-full flex flex-row">
                {transactionLoading && <LoadSkeleton />}

                <Sidebar title="Panel de control" description="Panel de control de las subzonas en un área." className="">
                    <SidebarHeader>
                        <div className="flex flex-col items-start w-full p-2">
                            <div className="flex items-center justify-between w-full">
                                <h1 className="text-xl font-bold">Subzonas</h1>
                                <Badge variant="outline" className="bg-gray-100">
                                    {zone.SubZonas.length}
                                </Badge>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                Gestiona las subzonas de <span className="font-medium">{zone.zoneName}</span>
                            </p>
                        </div>
                    </SidebarHeader>

                    <Separator className="my-4" />

                    <SidebarContent className="flex flex-col gap-4 w-full p-2">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-sm font-semibold text-gray-700">Todas las subzonas</h2>
                            <Button
                                size="sm"
                                variant="outline"
                                className="flex items-center gap-1"
                                onClick={handleAddSubzone}
                            >
                                <Plus className="w-4 h-4" />
                                <span>Añadir</span>
                            </Button>
                        </div>

                        <ScrollArea className="h-[calc(100vh-220px)] pr-2">
                            {zone.SubZonas.length > 0 ? (
                                <div className="flex flex-col gap-2">
                                    {zone.SubZonas.map((subzona) => (
                                        <Card
                                            key={subzona.id}
                                            className={`p-3 cursor-pointer border transition-all ${selectedSubzone === subzona.id
                                                ? "border-primary shadow-sm"
                                                : "hover:bg-gray-50"
                                                }`}
                                            onClick={() => handleSubzoneClick(subzona.id)}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: zone.zoneColor }}
                                                    />
                                                    <p className="font-medium">{subzona.zoneName}</p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 w-7 p-0"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditSubzone(subzona.id);
                                                        }}
                                                    >
                                                        <Edit2 className="w-4 h-4 text-gray-500" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 w-7 p-0"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteSubzone(subzona.id);
                                                        }}
                                                    >
                                                        <Trash className="w-4 h-4 text-gray-500" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {selectedSubzone === subzona.id && (
                                                <div className="mt-2 pt-2 border-t text-sm text-gray-500">
                                                    <p className="mb-1">ID: <span className="font-mono text-xs">{subzona.id}</span></p>
                                                    <p>Área: {subzona.zoneName || "No especificada"} m²</p>
                                                </div>
                                            )}
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <SadCircle className="w-10 h-10 text-gray-400 mb-3" />
                                    <p className="text-gray-500 mb-2">No hay subzonas en esta área</p>
                                    <Button
                                        size="sm"
                                        onClick={handleAddSubzone}
                                        className="mt-2"
                                    >
                                        Crear primera subzona
                                    </Button>
                                </div>
                            )}
                        </ScrollArea>
                    </SidebarContent>
                    <SidebarFooter>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="w-full"
                            onClick={() => exitEditMode()}
                        >
                            Cerrar
                        </Button>
                    </SidebarFooter>
                </Sidebar>

                <SidebarTrigger className="flex items-center justify-center h-full bg-white" />
            </div>
        </div>
    );
}