import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FatCornerUpLeft, SadCircle } from "@mynaui/icons-react";
import Link from "next/link";

interface InfoInstrumentoNoEncontradoProps {
    codigoInstrumento?: string;
}

export default function InfoInstrumentoNoEncontrado({ codigoInstrumento }: Readonly<InfoInstrumentoNoEncontradoProps>) {
    return (

        <Card className="w-full max-w-3xl mx-auto mt-8">
            <CardContent className="flex flex-col items-center justify-center  py-6">
                <SadCircle className="h-12 w-12 text-muted-foreground mx-auto" />
                <h2 className="text-xl font-bold text-center text-muted-foreground">Instrumento no encontrado</h2>
                <p className="text-sm text-muted-foreground text-center ">
                    No se ha encontrado un instrumento con el código {codigoInstrumento}
                </p>
                <Link href={`/instrumentos`}>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="mt-4"

                    >
                        <span className="">Volver al listado</span>
                        <FatCornerUpLeft className="w-6 h-6" />

                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}