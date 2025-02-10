import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import Link from "next/link";

interface ConfirmStepProps {
    onClick: () => void;
}



export default function ConfirmStep({onClick}: Readonly<ConfirmStepProps>) {
    return (
        <div className="flex flex-col gap-2 text-center items-center justify-center w-full h-full">
            <CheckIcon className="h-12 w-12 text-green-500" />
            <h2 className="text-2xl font-semibold text-gray-800">¡Carga confirmada!</h2>
            <p className="text-gray-600">Tus datos han sido procesados correctamente.</p>
            <div className="flex flex-row items-center justify-center gap-4">
                <Button onClick={onClick}>
                    Cargar otro archivo
                </Button>
                <Link href="/instrumentos">
                    <Button variant="outline">Volver al listado</Button>
                </Link>
            </div>
        </div>
    )
}