import { EntregaInstrumentosDto } from "@/types/entregasType";
import EntregasCard from "./entregasCard";




export default function EntregasList({ entregas }: Readonly<{ entregas: EntregaInstrumentosDto[] }>) {
    return (
        <div className="space-y-3">
            {entregas.map((entrega) => {
                return <EntregasCard entrega={entrega} key={entrega.id} />;
            })}
        </div>
    );
}