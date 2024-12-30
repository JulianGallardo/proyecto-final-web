import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import NewZoneForm from "./NewZoneForm"



export function AddZoneDialog({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {

    

    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogContent className="sm:max-w-[425px] rounded-lg">
                <DialogHeader>
                    <DialogTitle>Add Zone</DialogTitle>
                    <DialogDescription>
                        Enter the name of the zone and select a color for it.
                    </DialogDescription>
                </DialogHeader>
                <NewZoneForm  manageDialog={setOpen}/>
            </DialogContent>
        </Dialog>
    )
}
