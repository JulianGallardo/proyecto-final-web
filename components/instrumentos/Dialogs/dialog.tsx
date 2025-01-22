import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useCustomDialog } from "@/hooks/useCustomDialog"


interface DialogProps{
    propDialogTrigger?: React.ReactNode
    propDialogContent: React.ReactNode
    dialogTitle: string	
    dialogDescription?: string
    customClose?: boolean
    onClose?: (open:boolean) => void
}


export default function CustomDialog({propDialogTrigger,propDialogContent,dialogDescription,dialogTitle,customClose,onClose}:Readonly<DialogProps>){

    const {isOpen,setIsOpen} = useCustomDialog()

    
    return (
        <Dialog open={isOpen} onOpenChange={ setIsOpen}>
            <DialogTrigger asChild>
                {propDialogTrigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
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