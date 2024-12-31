import { Button } from "@/components/ui/button";

interface ViewPanelProps {
    setEditing: (editing:boolean) => void;
}

export default function ViewPanel({ setEditing }: ViewPanelProps) {
    return (
        <div className="flex flex-col w-full pt-5 pb-5  gap-5 items-center justify-center">
            <Button onClick={()=>setEditing(true)} className="bg-green-500 hover:bg-green-800">
                Editar Zonas
            </Button>
        </div>
    );
}