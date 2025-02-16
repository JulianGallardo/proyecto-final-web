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
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Instrumentos entregados por mes</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Overview />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Instrumentos por estado</CardTitle>
                        <CardDescription>Hay 127 agentes activos este mes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <InstrumentosPorEstado />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}