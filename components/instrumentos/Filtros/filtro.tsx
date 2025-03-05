import { Checkbox } from "@/components/ui/checkbox";

interface FiltroProps {
    displayName: string;
    children: React.ReactNode;
    isActive: boolean;
    onToggle: () => void;
}

export default function Filtro({ displayName, children, isActive, onToggle }: Readonly<FiltroProps>) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
                <Checkbox
                    checked={isActive}
                    onClick={onToggle}
                    className={`w-5 h-5 border-2 rounded-md ${isActive ? "bg-blue-500 border-blue-500" : "border-gray-400"}`}
                />
                <span className="text-sm text-gray-800 font-medium">{displayName}</span>
            </div>
            {isActive && <div className="mt-2">{children}</div>}
        </div>
    );
}