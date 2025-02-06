import { Button } from "@/components/ui/button";
import { AgenteExtendidoDto } from "@/types/agenteTypes";

interface AgenteInfoSectionProps {
    agente: AgenteExtendidoDto;
}

export default function AgenteInfoSection({ agente }: Readonly<AgenteInfoSectionProps>) {
    return (
        <div className="flex flex-col md:grid grid-cols-2 mb-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-lg"><span className="font-semibold">Nombre:</span> {agente.user.name}</p>
            <p className="text-lg"><span className="font-semibold">Email:</span> {agente.user.email}</p>

            <Button className="w-fit mt-2 bg-gray-800 text-white font-medium px-6 py-2 rounded-lg hover:bg-gray-700 transition-all">
                Editar Información
            </Button>
        </div>
    );
}