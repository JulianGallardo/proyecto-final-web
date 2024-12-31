import { Button } from "@/components/ui/button";
import { Edit } from "@mynaui/icons-react";

interface ViewPanelProps {
    setEditing: (editing:boolean) => void;
}

export default function ViewPanel({ setEditing }: ViewPanelProps) {
    return (
        <div className="flex flex-col w-full   gap-5 items-center justify-center">
            <Button onClick={()=>setEditing(true)} className="bg-green-500 hover:bg-green-800 w-full">
                Editar Zonas
                <Edit />
            </Button>
        </div>
    );
}