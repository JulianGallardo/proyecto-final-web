// EntregasWrapper.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Session } from "next-auth";
import { Suspense } from "react";
interface EntregasWrapperProps {
    agenteId: number;
    user: Session;
    searchParams: SearchParams;
}

export default function EntregasWrapper({
    agenteId,
    user,
    searchParams
}: Readonly<EntregasWrapperProps>) {
    const selectedDate = searchParams.date ?? new Date().toISOString().split('T')[0];

    return (
        <div className="p-2 space-y-2 w-full">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Seleccionar Fecha</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col space-y-4">
                    <DateSelector defaultValue={selectedDate} />
                    
                    {!selectedDate ? (
                        <EmptyDateMessage />
                    ) : (
                        <Suspense fallback={<EntregasSkeleton />}>
                            <EntregasContent 
                                agenteId={agenteId}
                                user={user}
                                searchParams={searchParams}
                            />
                        </Suspense>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// EntregasContent.tsx
import { canEdit } from "@/permissions/hasPermissions";
import { Resource } from "@/permissions/typePermissions";
import { parseDate } from "@/lib/utils";
import { getEntregasPaginated, getTotalPages } from "@/actions/entrega-instrumentos-actions";
import PaginationInstruments from "../shared/Pagination";
import EntregasList from "./entregasList";
import { SearchX } from "@mynaui/icons-react"; 
import EntregasSkeleton from "./entregasListSkeleton";
import DateSelector from "./datePicker";

interface EntregasContentProps {
    agenteId: number;
    user: Session;
    searchParams: SearchParams;
}

export async function EntregasContent({
    agenteId,
    user,
    searchParams
}: Readonly<EntregasContentProps>) {
    const currentPage = Number(searchParams.page) || 1;
    const selectedDate = searchParams.date ?? new Date().toISOString().split('T')[0];
    const permisos = canEdit(user.user.role, Resource.ENTREGAS);

    try {
        const [entregas, totalPages] = await Promise.all([
            getEntregasPaginated(currentPage, agenteId, selectedDate),
            getTotalPages(agenteId, selectedDate)
        ]);

        if (entregas.length === 0) {
            return <NoEntregasMessage date={selectedDate} />;
        }

        return (
            <div className="flex flex-col space-y-4 w-full">
                <DateDisplay date={selectedDate} />
                <EntregasList entregas={entregas} permisos={permisos} />
                <PaginationInstruments totalPages={totalPages} />
            </div>
        );
    } catch (error) {
        console.error(error);
        return <ErrorMessage />;
    }
}

// Components for UI states
function EmptyDateMessage() {
    return (
        <div className="flex flex-col items-center space-y-2">
            <SearchX className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="text-sm text-gray-400 font-semibold">
                Seleccione una fecha para ver las entregas.
            </p>
        </div>
    );
}

function NoEntregasMessage({ date }: Readonly<{ date: string }>) {
    return (
        <div className="flex flex-col items-center space-y-2">
            <SearchX className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="text-sm text-gray-400 font-semibold">
                No hay entregas para la fecha {parseDate(date)}.
            </p>
        </div>
    );
}

function DateDisplay({ date }: Readonly<{ date: string }>) {
    return (
        <p className="text-sm text-gray-400 font-semibold">
            Entregas para el {parseDate(date)}
        </p>
    );
}

function ErrorMessage() {
    return (
        <div className="text-red-500 text-sm font-semibold">
            No se pudieron cargar las entregas.
        </div>
    );
}

// types.ts
export interface SearchParams {
    page?: string;
    date?: string;
}