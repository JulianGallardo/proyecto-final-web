import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchX } from "@mynaui/icons-react";
import { getEntregasPaginated, getTotalPages } from "@/actions/entrega-instrumentos-actions";
import { EntregaInstrumentosDto } from "@/types/entregasType";
import PaginationInstruments from "@/components/instrumentos/Tabla/Pagination";
import { parseDate } from "@/lib/utils";
import EntregasList from "./entregasList";
import { Session } from "next-auth";
import { Input } from "../ui/input";

interface EntregasRepartidorProps {
    agenteId: number;
    user: Session;
    searchParams: {
        page?: string;
        date?: string;
    };
}

export default async function EntregasServerSide({ 
    agenteId, 
    user, 
    searchParams 
}: Readonly<EntregasRepartidorProps>) {
    const currentPage = Number(searchParams.page) || 1;
    const selectedDate = searchParams.date ?? new Date().toISOString().split('T')[0];

    // Fetch data server-side
    let entregas: EntregaInstrumentosDto[] = [];
    let totalPages = 0;
    let error = null;

    try {
        entregas = await getEntregasPaginated(currentPage, agenteId, selectedDate);
        totalPages = await getTotalPages(agenteId, selectedDate);
    } catch (e) {
        error = "No se pudieron cargar las entregas.";
        console.error(e);
    }

    return (
        <div className="p-2 space-y-2 w-full">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Seleccionar Fecha</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col space-y-4">
                    {/* Convert to form for server actions */}
                    <form action="/entregas" className="w-full">
                        <Input
                            type="date"
                            name="date"
                            defaultValue={selectedDate}
                            className="w-full p-2 rounded-md"
                        />
                    </form>

                    {error && (
                        <div className="text-red-500 text-sm font-semibold">
                            {error}
                        </div>
                    )}

                    {!selectedDate ? (
                        <div className="flex flex-col items-center space-y-2">
                            <SearchX className="w-12 h-12 text-gray-400 mx-auto" />
                            <p className="text-sm text-gray-400 font-semibold">
                                Seleccione una fecha para ver las entregas.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center space-y-2">
                            <p className="text-sm text-gray-400 font-semibold">
                                Entregas para el {parseDate(selectedDate)}
                            </p>
                            {entregas.length > 0 ? (
                                <div className="flex flex-col space-y-4 w-full">
                                    <EntregasList entregas={entregas} />
                                    <PaginationInstruments totalPages={totalPages} />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center space-y-2">
                                    <SearchX className="w-12 h-12 text-gray-400 mx-auto" />
                                    <p className="text-sm text-gray-400 font-semibold">
                                        No hay entregas para la fecha seleccionada.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}