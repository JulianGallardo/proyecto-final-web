import { Search } from "@mynaui/icons-react";
import { Input } from "@/components/ui/input";


interface InputSearchProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
}



export default function InputSearch({ searchTerm, setSearchTerm }: Readonly<InputSearchProps>) {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
                placeholder="Buscar por código, tipo, carátula o destinatario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10"
            />
        </div>
    );
}
