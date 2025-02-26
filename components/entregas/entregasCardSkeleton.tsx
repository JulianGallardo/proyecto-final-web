
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function EntregaCardSkeleton() {
    return (
        <Card className="border-l-4 border-l-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row gap-2 items-center justify-between">
                    {/* Title skeleton */}
                    <Skeleton className="h-6 w-48" />
                    {/* Badge skeleton */}
                    <Skeleton className="h-5 w-32" />
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* Info rows */}
                {[...Array(6)].map((a, index) => (
                    <div key={index + a} className="flex items-center gap-2">

                        <Skeleton className="h-4 flex-1" />
                    </div>
                ))}

                {/* Observaciones skeleton - full width */}
                <div className="col-span-full mt-2">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-16 w-full" />
                </div>

            </CardContent>
        </Card>
    );
}