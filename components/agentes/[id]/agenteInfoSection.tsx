import CustomDialog from "@/components/instrumentos/Dialogs/dialog";
import { Button } from "@/components/ui/button";
import { useCustomDialog } from "@/hooks/useCustomDialog";
import { AgenteExtendidoDto, UpdateAgenteDto } from "@/types/agenteTypes";
import { FormularioEditarAgente } from "./form/editAgentForm";
import { updateAgente } from "@/actions/agente-actions";
import { toast } from "@/hooks/use-toast";

interface AgenteInfoSectionProps {
    agente: AgenteExtendidoDto;
}

export default function AgenteInfoSection({ agente }: Readonly<AgenteInfoSectionProps>) {
    const { setIsOpen } = useCustomDialog();



    async function onSubmit(data: UpdateAgenteDto) {
        try {
            await updateAgente(agente.id, data);

            toast({
                title: "Agente actualizado",
                description: "El agente ha sido actualizado con éxito.",
                className: "bg-green-500 text-white",
                duration: 3000,
            });
            window.location.reload();

        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Ha ocurrido un error al registrar el nuevo agente.",
                className: "bg-red-500 text-white",
                duration: 3000,
            });


        }
        setIsOpen(false);

    }



    return (
        <div className="flex flex-col md:grid grid-cols-2 mb-4 p-4 bg-gray-100 rounded-lg">
            <CustomDialog
                dialogTitle="Editar información"
                dialogDescription="Editar la información del agente"
                propDialogContent={
                    <FormularioEditarAgente agente={agente} onSubmit={onSubmit} />
                }
            />

            <p className="text-lg"><span className="font-semibold">Nombre:</span> {agente.user.name}</p>
            <p className="text-lg"><span className="font-semibold">Apellido:</span> {agente.user.lastname ?? "No registrado"}</p>
            <p className="text-lg"><span className="font-semibold">Email:</span> {agente.user.email}</p>
            <p className="text-lg"><span className="font-semibold">Teléfono:</span> {agente.user.telefono ? agente.user.telefono.toString() : "No registrado"}</p>


            <Button className="w-fit mt-2 bg-gray-800 text-white font-medium px-6 py-2 rounded-lg hover:bg-gray-700 transition-all"
                onClick={() => setIsOpen(true)}
            >
                Editar Información
            </Button>
        </div>
    );
}