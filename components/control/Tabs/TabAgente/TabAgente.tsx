import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "../../overview";
import InstrumentosPorEstado from "../../estadisticasEntregas";
import TotalInstrumentos from "../TabGeneral/TotalInstrumentos";
import TotalInsturmentosActivos from "../TabGeneral/TotalInstrumentosActivos";
import TotalAgentes from "../TabGeneral/TotalAgentes";
import TotalZonas from "../TabGeneral/TotalZonas";

export default function TabAgentes() {
    const [selectedAgent, setSelectedAgent] = useState(null);

    // Simulación de lista de agentes, en tu caso, puede venir de una API o estado global
    const agents = [
        { id: 1, name: "Agente 1" },
        { id: 2, name: "Agente 2" },
        { id: 3, name: "Agente 3" },
    ];

    const handleAgentChange = (event) => {
        setSelectedAgent(event.target.value);
    };

    return (
        <div className="space-y-4">
            {/* Selector de agente */}
            <div className="mb-4">
                <label htmlFor="agent-select" className="block text-sm font-medium text-gray-700">Selecciona un agente</label>
                <select
                    id="agent-select"
                    value={selectedAgent || ""}
                    onChange={handleAgentChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <option value="">--Selecciona un agente--</option>
                    {agents.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                            {agent.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Si no hay agente seleccionado, no mostramos el resto */}
            {selectedAgent ? (
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
            ) : (
                <div className="text-center text-gray-500">Selecciona un agente para ver las estadísticas.</div>
            )}
        </div>
    );
}
