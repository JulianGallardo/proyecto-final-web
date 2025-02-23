import { EstadoEntrega, EstadoInstrumento, Instrumento, TipoCarga, UrgenciaInstrumento } from "@prisma/client";

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
  domicilio_denunciado: string;
  juzgadoIdentifier: string;
  instrumentoTypeIdentifier: string;
  tipoDeCarga: TipoCarga;
  codigo: string;
  urgencia: UrgenciaInstrumento;
  estado: EstadoInstrumento;

  observaciones:string;
}

export interface InstrumentoDtoWithError extends InstrumentoDTO {
  error: string;
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

export interface InstrumentoExtendidoConEntregas extends InstrumentoExtendido {
  HistorialEntregas: {
    fecha_entrega: Date;
    observaciones: string;
    estado: EstadoEntrega;
    agenteFullName: string;
  }[];
}

export interface InstrumentoTypeDTO extends InstrumentoTypeInput {
  id: number;
}

export interface InstrumentoTypeInput {
  name: string;
  identifier: string;
  createdAt: Date;
  updatedAt: Date;
}