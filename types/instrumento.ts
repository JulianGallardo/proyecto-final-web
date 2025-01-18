export interface Instrumento {
  id: string;
  fechaEntrada: Date;
  caratula: string;
  destinatario: string;
  direccion: string;
  numeroOrden: string;
  identificadorJuzgado: string;
  tipoInstrumento: string;
}

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
