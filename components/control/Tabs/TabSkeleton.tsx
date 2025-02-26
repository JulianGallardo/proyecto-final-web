import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TabGeneralSkeleton() {
  return (
    <div className="space-y-4">
      {/* Primera fila de cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-[150px]" />
              </CardTitle>
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[100px] mb-2" />
              <Skeleton className="h-4 w-[140px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Segunda fila con gráfico y estado */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Overview Chart Skeleton */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-[200px]" />
            </CardTitle>
            <Skeleton className="h-4 w-[300px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>

        {/* Instrumentos por Estado Skeleton */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-[200px]" />
            </CardTitle>
            <Skeleton className="h-4 w-[250px]" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col w-full gap-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}