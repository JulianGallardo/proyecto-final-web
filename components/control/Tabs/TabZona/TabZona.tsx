
import Overview from "../../overview";
import InstrumentosPorEstado from "../../estadisticasEntregas";
import TotalInstrumentos from "../TabGeneral/TotalInstrumentos";
import TotalInsturmentosActivos from "../TabGeneral/TotalInstrumentosActivos";
import { getAllZones } from "@/actions/zone-actions";
import SelectZona from "./SelectZona";


interface TabGeneralProps {
    totalInstrumentos: {
        total: number;
        growthPercentage: number;
    }
    totalInstrumentosActivos: {
        totalActivos: number;
        growthPercentage: number;
    }
    totalAgentes: {
        total: number;
        growth: number;
    }
    totalZonas: number
    data: { month: string; year: number; count: number }[]
    instrumentos: { [estado: string]: number }
}


export default async function TabZonas({ totalInstrumentos, totalInstrumentosActivos, data, instrumentos }: Readonly<TabGeneralProps>) {
    const zonas = await getAllZones();
    const zoneNames = zonas.map(zone => zone.properties.name);
    return (
        <div className="space-y-4">
            <SelectZona zoneNames={zoneNames} />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <TotalInstrumentos totalInstrumentos={totalInstrumentos.total} growth={totalInstrumentos.growthPercentage} />
                <TotalInsturmentosActivos totalInstrumentos={totalInstrumentosActivos.totalActivos} growth={totalInstrumentosActivos.growthPercentage} />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Overview data={data} />
                <InstrumentosPorEstado instrumentos={instrumentos} />

            </div>
        </div>
    );
}