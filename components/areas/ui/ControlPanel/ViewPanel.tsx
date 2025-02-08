import { Button } from "@/components/ui/button";
import { canEdit } from "@/permissions/hasPermissions";
import { Resource } from "@/permissions/typePermissions";
import { Edit } from "@mynaui/icons-react";
import { useSession } from "next-auth/react";

interface ViewPanelProps {
    setEditing: (editing: boolean) => void;
}

export default function ViewPanel({ setEditing }: ViewPanelProps) {
    const user = useSession();
    const userData = user.data?.user;

    console.log(userData);

    return (
        <div className="flex flex-col w-full   gap-5 items-center justify-center">
            {
                canEdit(userData?.role, Resource.ZONAS) && (
                    <Button onClick={() => setEditing(true)} className="bg-green-500 hover:bg-green-800 w-full">
                        Editar Zonas
                        <Edit />
                    </Button>
                )

            }

        </div>
    );
}