import BtnLogout from "@/components/auth/btn-logout";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { canView } from "@/permissions/hasPermissions";
import { AgenteExtendidoDto } from "@/types/agenteTypes";
import { Logout } from "@mynaui/icons-react";
import { Link } from "lucide-react";
import Config from "next/config";
import ManageZones from "./manageZones";
import { Accordion } from "@/components/ui/accordion";

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