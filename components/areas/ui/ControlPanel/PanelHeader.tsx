import { DrawingModes } from "@/types/MapTypes";
import EditingPanel from "./EditingPanel";
import ViewPanel from "./ViewPanel";

interface PanelHeaderProps {
    onEdit: () => void;
    saveZoneEdits: () => void;
    discardZoneEdits: () => void;
    saveChanges: () => void;
    discardChanges: () => void;
    addZone: () => void;
    mode: DrawingModes;
    editing: boolean;
    setEditing: (editing: boolean) => void;
    setRenderMode: () => void;
    
}



export default function PanelHeader({ onEdit, addZone, mode, saveZoneEdits, discardZoneEdits, saveChanges, editing, setEditing, setRenderMode, discardChanges }: Readonly<PanelHeaderProps>) {
    return (
        <div className="flex flex-col w-full pt-5 pb-5  gap-5 items-center justify-center">
            <div className="flex flex-col    items-center justify-center">
                <h2 className="text-xl font-semibold items-center justify-center text-gray-800 mb-3">Zonas</h2>
                <h4 className="text-sm text-gray-500">Administra las zonas de tu área</h4>
            </div>
            {
                editing ? <EditingPanel 
                onEdit={onEdit} 
                addZone={addZone} 
                mode={mode} 
                saveZoneEdits={saveZoneEdits} 
                discardZoneEdits={discardZoneEdits}
                saveChanges={saveChanges} 
                setRenderMode={setRenderMode}  
                discardChanges={discardChanges}
                /> 
                : 
                <ViewPanel setEditing={setEditing} />
            }
        </div>

    );
}

