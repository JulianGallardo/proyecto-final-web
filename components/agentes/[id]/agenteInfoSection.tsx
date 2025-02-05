import CustomDialog from "@/components/instrumentos/Dialogs/dialog";
import { Button } from "@/components/ui/button";
import { useCustomDialog } from "@/hooks/useCustomDialog";
import { AgenteExtendidoDto } from "@/types/agenteTypes";
import ManageZones from "./manageZones";

interface AgenteInfoSectionProps {
    agente: AgenteExtendidoDto;
}

export default function AgenteInfoSection({ agente }: Readonly<AgenteInfoSectionProps>) {
    const { setIsOpen } = useCustomDialog();

    const handleOpenDialog = () => {
        setIsOpen(true);
    }

    return (
        <div className="flex flex-col md:grid grid-cols-2 mb-4 p-4 bg-gray-100 rounded-lg">
            <CustomDialog
                dialogTitle="Editar Información"
                dialogDescription="Aquí puedes editar las zonas asignadas al agente."
                propDialogContent={
                    <ManageZones />
                }


            />

            <p className="text-lg"><span className="font-semibold">Nombre:</span> {agente.user.name}</p>
            <p className="text-lg"><span className="font-semibold">Email:</span> {agente.user.email}</p>

            <div className="flex flex-col md:flex-row col-span-2 gap-4 w-full p-4 md:justify-start">
                <Button
                    onClick={handleOpenDialog}
                    className="w-full md:w-auto border border-gray-400 text-gray-800 bg-white font-medium px-6 py-2 rounded-lg hover:bg-gray-200 transition-all">
                    Editar zonas asignadas
                </Button>
                <Button className="w-full md:w-auto bg-gray-800 text-white font-medium px-6 py-2 rounded-lg hover:bg-gray-700 transition-all">
                    Editar Información
                </Button>
            </div>

        </div>
    );
}