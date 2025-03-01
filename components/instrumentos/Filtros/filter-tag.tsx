import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "@mynaui/icons-react";

interface FilterTagProps {
    label: string;
    value: string;
    onRemove: () => void;
}

export default function FilterTag({ label, onRemove, value }: Readonly<FilterTagProps>) {
    return (
        <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1 bg-zinc-700 text-white hover:bg-zinc-800">
            {label}: {value}
            <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent" onClick={onRemove}>
                <X className="h-3 w-3 text-white/70 hover:text-white" />
                <span className="sr-only">Eliminar Filtro</span>
            </Button>
        </Badge>
    );
}