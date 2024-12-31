import EditZoneForm from "../Forms/EditZoneForm";
import { ZoneDialog } from "./ZoneDialog";

interface AddZoneDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    onDialogSubmit: () => void;
}




export function EditZoneDialog({ open, setOpen, onDialogSubmit}: AddZoneDialogProps) { 
    return (
        <ZoneDialog 
            title="Editar Zona"
            description="Edita la zona de tu área"
        open={open} setOpen={setOpen} onDialogSubmit={onDialogSubmit} Form={EditZoneForm} />
    )
}
