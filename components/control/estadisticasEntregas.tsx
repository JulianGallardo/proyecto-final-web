
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const estadoColores = {
    PENDIENTE_DE_ENTREGA: "bg-gray-500",
    PENDIENTE_DE_PROCESAR: "bg-blue-500",
    ENTREGADO_VERDE: "bg-green-500",
    ENTREGADO_AMARILLO: "bg-yellow-500",
    ENTREGADO_ROJO: "bg-red-500"
};

interface InstrumentosPorEstadoProps {
    instrumentos: { [estado: string]: number };
}


const InstrumentosPorEstado = ({ instrumentos }: Readonly<InstrumentosPorEstadoProps>) => {


    function getTextoEstado(estado: string) {
        switch (estado) {
            case "PENDIENTE_DE_ENTREGA":
                return "Pendiente de entrega";
            case "PENDIENTE_DE_PROCESAR":
                return "Pendiente de procesar la entrega";
            case "ENTREGADO_VERDE":
                return "Entregado en menos de una semana";
            case "ENTREGADO_AMARILLO":
                return "Entregado en menos de 2 semanas";
            case "ENTREGADO_ROJO":
                return "Entregado en mas de 2 semanas";
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
                        <Card key={estado} className={`p-4 text-white ${estadoColores[estado as keyof typeof estadoColores]}`}>
                            <h3 className="text-lg font-bold">{getTextoEstado(estado)}</h3>
                            <p className="text-2xl">{count}</p>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>

    );
};

export default InstrumentosPorEstado;
