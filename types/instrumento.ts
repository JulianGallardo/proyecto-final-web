import { Instrumento } from "@prisma/client";

export interface InstrumentoDTO {
  entryDate: Date;
  exitDate: Date | null;
  caratula: string;
  destinatario: string;
  address: string;
  ordenNumber: string;
  juzgadoId: number;
  instrumentoTypeId: number;
}

export interface InstrumentoExtendido extends Instrumento {
  juzgado: {
    name: string;
    identifier: string;
  };
  instrumentoType: {
    name: string;
    identifier: string;
  };
}