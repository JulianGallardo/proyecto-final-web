import { EntregaCardSkeleton } from "./entregasCardSkeleton";

export default function EntregasSkeleton() {
    return (
        <div className="space-y-4 w-full">
            {[...Array(3)].map((a, i) => (
                <EntregaCardSkeleton key={`skeleton-${i + a}`} />
            ))}
        </div>
    );
}
