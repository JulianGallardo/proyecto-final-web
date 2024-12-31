import EditingPanel from "./EditingPanel";
import ViewPanel from "./ViewPanel";

interface PanelHeaderProps {
    onEdit: () => void;
    saveZoneEdits: () => void;
    saveChanges: () => void;
    addZone: () => void;
    mode: string;
    editing: boolean;
    setEditing: (editing: boolean) => void;
}



export default function PanelHeader({ onEdit, addZone, mode,saveZoneEdits,saveChanges,editing,setEditing }: PanelHeaderProps) {
    return (
        <div className="flex flex-col w-full pt-5 pb-5  gap-5 items-center justify-center">
            <div className="flex flex-col    items-center justify-center">
                <h2 className="text-xl font-semibold items-center justify-center text-gray-800 mb-3">Zonas</h2>
                <h4 className="text-sm text-gray-500">Administra las zonas de tu área</h4>
            </div>
            {
                editing ? <EditingPanel onEdit={onEdit} addZone={addZone} mode={mode} saveZoneEdits={saveZoneEdits} saveChanges={saveChanges}  /> : <ViewPanel setEditing={setEditing}/>
            }
            
            
            




        </div>

    );
}

