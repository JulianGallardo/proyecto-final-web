import { EstadoEntrega, TipoCarga } from "@prisma/client";

export interface EntregaInstrumentosDto{
    id: number;
    instrumento: {
        caratula: string;
        domicilio_denunciado: string;
        instrumentoType: {
            name: string;
        };
        codigoInstrumento: string;
        cargaInstrumento: TipoCarga;
        orden: {
            ordenNumber: string;
            juzgado: {
                name: string;
            };
        };
        instrumentoId: number;
    };
    fecha_entrega: Date;
    estado: EstadoEntrega;
    observaciones: string;
    updatedAt: Date;
}