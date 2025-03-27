import { Badge } from "@/components/ui/badge";
import { ExtendedZone } from "@/types/ZoneTypes";
import SubZoneEditingPanel from "./subZoneEditingPanel";
import SubZoneViewPanel from "./subZoneViewPanel";
import { CustomFeature, DrawingModesSubZonas } from "@/types/MapTypes";


interface SubZonePanelHeaderProps {
    addSubZone: () => void;
    discardChanges: () => void;
    discardSubZoneEdits: () => void;
    saveChanges: () => void;
    saveSubZoneEdits: () => void;
    setRenderMode: () => void;
    onEdit: () => void;
    editing: boolean;
    setEditing: (editing: boolean) => void;
    subZones: CustomFeature[];
    zone: ExtendedZone;
    mode: DrawingModesSubZonas;
    exitSubZoneView: () => void;
}


export default function SubZonePanelHeader(
    {
        editing,
        setEditing,
        addSubZone,
        discardChanges,
        discardSubZoneEdits,
        saveChanges,
        saveSubZoneEdits,
        setRenderMode,
        onEdit,
        subZones,
        zone,
        mode,
        exitSubZoneView
    }: Readonly<SubZonePanelHeaderProps>
) {





    return (
        <div>
            <div className="flex flex-col items-start w-full p-2">
                <div className="flex items-center justify-between w-full">
                    <h1 className="text-xl font-bold">Subzonas</h1>
                    <Badge variant="outline" className="bg-gray-100">
                        {subZones.length}
                    </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                    Gestionando zona <span className="font-medium">{zone.zoneName}</span>
                </p>
            </div>

            {
                editing ? <SubZoneEditingPanel
                    addSubZone={addSubZone}
                    discardChanges={discardChanges}
                    discardSubZoneEdits={discardSubZoneEdits}
                    mode={mode}
                    onEdit={onEdit}
                    saveChanges={saveChanges}
                    saveSubZoneEdits={saveSubZoneEdits}
                    setRenderMode={setRenderMode}
                />
                    :
                    <SubZoneViewPanel setEditing={setEditing} exitSubZoneView={exitSubZoneView} />
            }

        </div>
    )
}