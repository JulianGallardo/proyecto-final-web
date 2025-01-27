import { Instrumento } from "@prisma/client";

export interface InstrumentPDFDTO {
    organismo: string;
    caratula: string;
    numero: number;
    destinatario: string;
    domicilio: string;
    destinatarioPostal: string;
    altaDisponibilidad: string;
    notificacion: string;
    tramite: string;
    codigo: string;
    estado: string;
}

export interface InstrumentoDTO {
  entryDate: Date;
  exitDate: Date | null;
  caratula: string;
  destinatario: string;
  address: string;
  juzgadoIdentifier: string;
  instrumentoTypeIdentifier: string;
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