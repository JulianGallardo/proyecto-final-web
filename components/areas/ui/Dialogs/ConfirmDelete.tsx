'use client'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

interface ConfirmDeleteProps {
    title?: string
    description?: string
    onConfirm: () => void
    triggerText?: string
    open: boolean
    setOpen: (open: boolean) => void
}

export function ConfirmDelete({
    title = 'Are you sure?',
    description = 'This action cannot be undone. This will permanently delete the item.',
    onConfirm,
    open,
    setOpen,
}: ConfirmDeleteProps) {

    const handleConfirm = () => {
        onConfirm()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[325px] sm:max-w-[525px] rounded-md flex flex-col gap-2">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button variant="destructive" onClick={handleConfirm}>
                        Borrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

