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
  fecha_de_ingreso: Date;
  fecha_de_salida: Date | null;
  caratula: string;
  destinatario: string;
  domicilio_denunciado: string;
  juzgadoIdentifier: string;
  instrumentoTypeIdentifier: string;
}

export interface InstrumentoExtendido extends Instrumento {
  orden:{
    ordenNumber: number;
    juzgadoId: number;
    juzgado: {
      identifier: string;
      name: string;
    }
  }
  instrumentoType: {
    name: string;
    identifier: string;
  };
}