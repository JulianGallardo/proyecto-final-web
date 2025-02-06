export interface EntregaInstrumentosDto{
    id: number;
    instrumento: {
        caratula: string;
        domicilio_denunciado: string;
        instrumentoType: {
            name: string;
        };
        orden: {
            ordenNumber: string;
            juzgado: {
                name: string;
            };
        };
        instrumentoId: number;
    };
    createdAt: Date;
    updatedAt: Date;
}