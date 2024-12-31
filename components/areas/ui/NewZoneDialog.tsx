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
                    <DialogTitle>Nueva zona</DialogTitle>
                    <DialogDescription>
                        Agrega una nueva zona a tu área
                    </DialogDescription>
                </DialogHeader>
                <NewZoneForm  manageDialog={setOpen}/>
            </DialogContent>
        </Dialog>
    )
}
