import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useCustomDialog } from "@/hooks/useCustomDialog"


interface DialogProps {
    propDialogTrigger?: React.ReactNode
    propDialogContent: React.ReactNode
    dialogTitle: string
    dialogDescription?: string
    customClose?: boolean
    onClose?: (open: boolean) => void
}


export default function CustomDialog({ propDialogTrigger, propDialogContent, dialogDescription, dialogTitle, customClose, onClose }: Readonly<DialogProps>) {

    const { isOpen, setIsOpen } = useCustomDialog()


    return (
        <Dialog open={isOpen} onOpenChange={customClose ? onClose : setIsOpen}>
            <DialogTrigger asChild>
                {propDialogTrigger}
            </DialogTrigger>
            <DialogContent /***
             * onInteractOutside={(e) => {
                const hasPacItem = e.composedPath().some((el: EventTarget) => {
                    if ('classList' in el) {
                        return Array.from((el as Element).classList).includes('pac-item');
                    }
                    return false;
                });

                // if we click an autocomplete item, prevent the default onInteractOutside action, to close
                if (hasPacItem) {
                    e.preventDefault();
                }
            }}
                **/ className="max-h-screen overflow-y-auto sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px] sm:rounded-none md:rounded-md " >

                <DialogHeader>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogDescription>
                        {dialogDescription}
                    </DialogDescription>
                </DialogHeader>
                {propDialogContent}
            </DialogContent>
        </Dialog>
    )
}