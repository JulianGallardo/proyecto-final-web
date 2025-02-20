import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EstadoInstrumento } from "@prisma/client";

interface InstrumentosPorEstadoProps {
    instrumentos: Record<EstadoInstrumento, number>;
}

const StyleByStatus = {
    [EstadoInstrumento.CORRECCIONES_SOLICITADAS]: 'bg-purple-100 text-purple-800 border-purple-500 hover:bg-purple-400',
    [EstadoInstrumento.PENDIENTE_DE_PROCESAR_NOTIFICACION]: 'bg-gray-100 text-gray-800 border-gray-500 hover:bg-gray-400',
    [EstadoInstrumento.PENDIENTE_DE_NOTIFICAR]: 'bg-blue-100 text-blue-800 border-blue-500 hover:bg-blue-400',
    [EstadoInstrumento.NOTIFICADO_VERDE]: 'bg-green-100 text-green-800 border-green-500 hover:bg-green-400',
    [EstadoInstrumento.NOTIFICADO_AMARILLO]: 'bg-yellow-100 text-yellow-800 border-yellow-500 hover:bg-yellow-400',
    [EstadoInstrumento.NOTIFICADO_ROJO]: 'bg-red-100 text-red-800 border-red-500 hover:bg-red-400',
};

const InstrumentosPorEstado = ({ instrumentos }: Readonly<InstrumentosPorEstadoProps>) => {
    function getTextoEstado(estado: EstadoInstrumento) {
        switch (estado) {
            case EstadoInstrumento.CORRECCIONES_SOLICITADAS:
                return "Correcciones solicitadas";
            case EstadoInstrumento.PENDIENTE_DE_NOTIFICAR:
                return "Pendiente de notificar";
            case EstadoInstrumento.PENDIENTE_DE_PROCESAR_NOTIFICACION:
                return "Pendiente de procesar la notificación";
            case EstadoInstrumento.NOTIFICADO_VERDE:
                return "Notificado en menos de una semana";
            case EstadoInstrumento.NOTIFICADO_AMARILLO:
                return "Notificado en menos de 2 semanas";
            case EstadoInstrumento.NOTIFICADO_ROJO:
                return "Notificado en mas de 2 semanas";
            default:
                return estado;
        }
    }

    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Instrumentos por estado</CardTitle>
                <CardDescription>
                    Desglose de instrumentos por estado.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col w-full gap-2">
                    {Object.entries(instrumentos).map(([estado, count]) => (
                        <Card
                            key={estado}
                            className={cn(
                                "flex justify-between p-4 ", StyleByStatus[estado as EstadoInstrumento]
                            )}
                        >
                            <h3 className="text-lg font-bold">{getTextoEstado(estado as EstadoInstrumento)}</h3>
                            <p className="text-2xl">{count}</p>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default InstrumentosPorEstado;