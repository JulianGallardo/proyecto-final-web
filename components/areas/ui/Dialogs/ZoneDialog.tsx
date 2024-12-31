import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import React from "react";

interface AddZoneDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    onDialogSubmit: () => void;
    Form: React.ElementType; // Formulario que se pasará como componente
    title: string;
    description: string;
}

export function ZoneDialog({ title,description,open, setOpen, onDialogSubmit, Form }: AddZoneDialogProps) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px] rounded-lg">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <Form manageDialog={setOpen} onDialogSubmit={onDialogSubmit} />
            </DialogContent>
        </Dialog>
    );
}
