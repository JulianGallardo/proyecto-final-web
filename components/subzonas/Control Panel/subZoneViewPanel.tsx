import { Button } from "@/components/ui/button";
import { Edit, FatCornerUpLeft } from "@mynaui/icons-react";

interface ViewPanelProps {
    exitSubZoneView: () => void;
    setEditing: (editing: boolean) => void;
}

export default function SubZoneViewPanel({ setEditing, exitSubZoneView }: Readonly<ViewPanelProps>) {
    


    return (
        <div className="flex flex-col w-full   gap-5 items-center justify-center">
            {
                <Button onClick={() => setEditing(true)} className="bg-green-500 hover:bg-green-800 w-full">
                    Editar SubZonas
                    <Edit />
                </Button>
            }
            <Button onClick={() => exitSubZoneView()} className="bg-blue-500 hover:bg-blue-800 w-full">
                Deseleccionar Zona
                <FatCornerUpLeft className="w-6 h-6" />
            </Button>

        </div>
    );
}