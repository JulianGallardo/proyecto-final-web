import NewZoneForm from "../Forms/NewZoneForm";
import { ZoneDialog } from "./ZoneDialog";

interface AddZoneDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    onDialogSubmit: () => void;
}




export function AddZoneDialog({ open, setOpen, onDialogSubmit }: AddZoneDialogProps) {
    return (
        <ZoneDialog
            title="Nueva Zona"
            description="Crea una nueva zona para tu área"
            open={open} setOpen={setOpen} onDialogSubmit={onDialogSubmit} Form={NewZoneForm} />
    )
}
