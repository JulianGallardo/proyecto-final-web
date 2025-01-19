import { Instrumento } from "@prisma/client";

export interface InstrumentoDTO {
  entryDate: Date;
  exitDate: Date;
  caratula: string;
  destinatario: string;
  address: string;
  ordenNumber: string;
  juzgadoId: string;
  instrumentoTypeId: string;
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