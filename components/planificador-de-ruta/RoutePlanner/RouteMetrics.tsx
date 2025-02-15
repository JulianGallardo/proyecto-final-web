import { Card, CardContent } from "@/components/ui/card";

interface RouteMetricsProps {
    metrics: { distance: number; duration: number } | null;
}

export function RouteMetrics({ metrics }: Readonly<RouteMetricsProps>) {

    if (!metrics) {
        return null;
    }

    return (
        <Card className="mt-4">
            <CardContent className="pt-4">
                <h3 className="font-semibold mb-2">Información de la ruta:</h3>
                <p>🛣️ Distancia total: {(metrics.distance / 1000).toFixed(2)} km</p>
                <p>⏱️ Tiempo estimado: {Math.round(metrics.duration / 60)} minutos</p>
            </CardContent>
        </Card>
    );
}
