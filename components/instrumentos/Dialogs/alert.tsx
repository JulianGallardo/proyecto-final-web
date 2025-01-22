import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useCustomAlert } from "@/hooks/useCustomAlert"


interface AlertDialogProps {
    propAlertDialogTrigger?: React.ReactNode
    propAlertDialogContent: React.ReactNode
    AlertDescription: string
    AlertTitle?: string
}


export default function CustomAlert({ propAlertDialogTrigger, propAlertDialogContent, AlertDescription, AlertTitle }: Readonly<AlertDialogProps>) {
    const { isOpenAlert, setIsOpenAlert } = useCustomAlert()


    return (
        <AlertDialog open={isOpenAlert} onOpenChange={setIsOpenAlert}>
            <AlertDialogTrigger asChild>
                {propAlertDialogTrigger}
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[425px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {AlertTitle}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {AlertDescription}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {propAlertDialogContent}
            </AlertDialogContent>
        </AlertDialog>
    )
}