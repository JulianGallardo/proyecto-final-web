import { Clock, MapPin } from "lucide-react";

interface RouteMetrics {
    routeMetrics: { distance: number; duration: number } | null;
}

export default function PreviewContent({ routeMetrics }: Readonly<RouteMetrics>) {
    

    return (
        <div className="p-2  bg-white ">
            <div className="flex items-center justify-between text-gray-900">
                {routeMetrics ? (
                    <>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-500" />
                            <span className="text-lg font-medium">
                                {(routeMetrics.distance / 1000).toFixed(2)} km
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-green-500" />
                            <span className="text-lg font-medium">
                                {Math.round(routeMetrics.duration / 60)} min
                            </span>
                        </div>
                    </>
                ) : (
                    <span className="text-lg font-semibold text-gray-500">
                        📍 Planifica tu ruta
                    </span>
                )}
            </div>
        </div>
    )

}