import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "../../overview";
import InstrumentosPorEstado from "../../estadisticasEntregas";
import TotalInstrumentos from "./TotalInstrumentos";
import TotalInsturmentosActivos from "./TotalInstrumentosActivos";
import TotalAgentes from "./TotalAgentes";
import TotalZonas from "./TotalZonas";

export default function TabGeneral() {
    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <TotalInstrumentos />
                <TotalInsturmentosActivos />
                <TotalAgentes />
                <TotalZonas />
                
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Overview />
                <InstrumentosPorEstado />
                
            </div>
        </div>
    );
}