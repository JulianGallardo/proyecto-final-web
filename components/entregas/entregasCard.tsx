import { EntregaInstrumentosDto } from "@/types/entregasType";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { EstadoEntrega } from "@prisma/client";
import { Button } from "../ui/button";

interface EntregaCardProps{
    entrega: EntregaInstrumentosDto
}

const getStatusColor = (estado: EstadoEntrega) => {
    switch (estado) {
        case EstadoEntrega.PENDIENTE_DE_PROCESAR:
            return 'bg-yellow-100 text-yellow-800 border-yellow-500 hover:bg-yellow-400';
        case EstadoEntrega.ENTREGADO:
            return 'bg-green-100 text-green-800 border-green-500 hover:bg-green-400';
        case EstadoEntrega.NO_ENTREGADO:
            return 'bg-red-100 text-red-800 border-red-500 hover:bg-red-400';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-500';
    }
};

export default function EntregasCard({ entrega }: Readonly<EntregaCardProps>) {

    const statusColor = getStatusColor(entrega.estado);
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

                {
                    <Button className="col-span-full" 
                    
                    >
                        Cargar Entrega
                    </Button>
                }
            </CardContent>
        </Card>
    )
}