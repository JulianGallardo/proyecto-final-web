import { EntregaInstrumentosDto } from "@/types/entregasType";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { EstadoEntrega } from "@prisma/client";
import { Button } from "../ui/button";
import { getEntregasStatusColor } from "@/lib/utils";

interface EntregaCardProps {
    entrega: EntregaInstrumentosDto | null,
    cargarEntrega: (entrega: EntregaInstrumentosDto) => void,
    permisos?: boolean
}



export default function EntregasCard({ entrega, cargarEntrega, permisos }: Readonly<EntregaCardProps>) {


    if (!entrega) return null;

    const statusColor = getEntregasStatusColor(entrega.estado);
    return (
        <Card
            key={entrega.id}
            className={`border-l-4 ${statusColor.split(' ')[2]} hover:shadow-md transition-shadow`}
        >
            <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row gap-2 items-center justify-between">
                    <CardTitle className="text-lg">
                        {entrega.instrumento.caratula}
                    </CardTitle>
                    <Badge className={statusColor}>
                        {entrega.estado.replace(/_/g, ' ')}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <span className="font-medium">Domicilio:</span>
                    {entrega.instrumento.domicilio_denunciado}
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-medium">Instrumento:</span>
                    {entrega.instrumento.instrumentoType.name}
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-medium">Código:</span>
                    {entrega.instrumento.cargaInstrumento} - {entrega.instrumento.codigoInstrumento}
                </div>

                <div className="flex items-center gap-2">
                    <span className="font-medium">Orden:</span>
                    {entrega.instrumento.orden.ordenNumber}
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-medium">Juzgado:</span>
                    {entrega.instrumento.orden.juzgado.name}
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-medium">Fecha:</span>
                    {new Date(entrega.fecha_entrega).toLocaleString()}
                </div>
                {entrega.observaciones && (
                    <div className="col-span-full mt-2">
                        <span className="font-medium">Observaciones:</span>
                        <p className="mt-1 text-gray-500">{entrega.observaciones}</p>
                    </div>
                )}

                { permisos &&
                    <Button className={`col-span-full bg-gray-200 text-black hover:bg-gray-300 ${entrega.estado === EstadoEntrega.PENDIENTE_DE_PROCESAR  && statusColor }`}
                        onClick={() => cargarEntrega(entrega)}
                    >
                        {
                            entrega.estado === EstadoEntrega.PENDIENTE_DE_PROCESAR ? "Cargar Entrega" : "Editar Entrega"
                        }
                    </Button>
                }
            </CardContent>
        </Card>
    )
}