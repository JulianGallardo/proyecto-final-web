import { Button } from "@/components/ui/button";
import { canEdit } from "@/permissions/hasPermissions";
import { Resource } from "@/permissions/typePermissions";
import { Edit, FatCornerUpLeft } from "@mynaui/icons-react";
import { useSession } from "next-auth/react";

interface ViewPanelProps {
    setEditing: (editing: boolean) => void;
}

export default function SubZoneViewPanel({ setEditing }: Readonly<ViewPanelProps>) {
    const user = useSession();
    const userData = user.data?.user;


    return (
        <div className="flex flex-col w-full   gap-5 items-center justify-center">
            {
                canEdit(userData?.role, Resource.SUB_ZONAS) && (
                    <Button onClick={() => setEditing(true)} className="bg-green-500 hover:bg-green-800 w-full">
                        Editar SubZonas
                        <Edit />
                    </Button>

                )


            }
            <Button className="bg-blue-500 hover:bg-blue-800 w-full">
                Deseleccionar Zona
                <FatCornerUpLeft className="w-6 h-6" />
            </Button>

        </div>
    );
}