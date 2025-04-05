import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import bcrypt from "bcryptjs";

import { DateTime } from "luxon";
import { EstadoEntrega, EstadoInstrumento } from "@prisma/client";
import { InstrumentoExtendido, InstrumentoDTO } from "@/types/instrumentoTypes";
import { ExtendedZone } from "@/types/ZoneTypes";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const safeRandomColor = () => {
  const letters = '456789ABCD';
  let color = '#';
  const array = new Uint8Array(6);
  crypto.getRandomValues(array);
  for (let i = 0; i < 6; i++) {
    color += letters[array[i] % letters.length];
  }
  return color;
};

export const parseDate = (date: string) => {
  // Interpreta explícitamente la fecha de entrada como UTC
  const dateParsed = DateTime.fromISO(date, { zone: 'America/Argentina/Buenos_Aires' })
  
  // Convierte a zona horaria de Argentina
  const dateInArgentina = dateParsed.setLocale('es').toLocaleString(DateTime.DATE_FULL);
  return dateInArgentina;
}

export const parseDataToYear = (date: string) => {
  const parsedDate = DateTime.fromFormat(date, "d/M/yyyy HH:mm:ss");
  const formattedDate = parsedDate.toFormat("yyyy-MM-dd");
  return formattedDate;
};

export const hashPassword = async (password: string) => {
  const saltNumber = 10;
  const hash = await bcrypt.hash(password, saltNumber);
  return hash;
}

export const getInstrumentosStatusColor = (estado: EstadoInstrumento) => {
  switch (estado) {
    case EstadoInstrumento.CORRECCIONES_SOLICITADAS:
      return 'bg-purple-100 text-purple-800 border-purple-500 hover:bg-purple-400';
    case EstadoInstrumento.PENDIENTE_DE_PROCESAR_NOTIFICACION:
      return 'bg-gray-100 text-gray-800 border-gray-500 hover:bg-gray-400';
    case EstadoInstrumento.PENDIENTE_DE_NOTIFICAR:
      return 'bg-blue-100 text-blue-800 border-blue-500 hover:bg-blue-400';
    case EstadoInstrumento.NOTIFICADO_VERDE:
      return 'bg-green-100 text-green-800 border-green-500 hover:bg-green-400';
    case EstadoInstrumento.NOTIFICADO_AMARILLO:
      return 'bg-yellow-100 text-yellow-800 border-yellow-500 hover:bg-yellow-400';
    case EstadoInstrumento.NOTIFICADO_ROJO:
      return 'bg-red-100 text-red-800 border-red-500 hover:bg-red-400';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-500 hover:bg-gray-400';
  }
};

export const getEntregasStatusColor = (estado: EstadoEntrega) => {
  switch (estado) {
    case EstadoEntrega.PENDIENTE_DE_PROCESAR:
      return 'bg-yellow-100 text-yellow-800 border-yellow-500 hover:bg-yellow-400';
    case EstadoEntrega.NOTIFICADO:
      return 'bg-green-100 text-green-800 border-green-500 hover:bg-green-400';
    case EstadoEntrega.NO_NOTIFICADO:
      return 'bg-red-100 text-red-800 border-red-500 hover:bg-red-400';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-500';
  }
};

export const convertToDto = (instrumento: InstrumentoExtendido | undefined,zonas:ExtendedZone[]): InstrumentoDTO | undefined => {
        if (!instrumento) {
            return undefined
        }


        const instrumentoDto: InstrumentoDTO = {
            fecha_de_ingreso: instrumento.fecha_de_ingreso,
            fecha_de_salida: instrumento.fecha_de_salida,
            caratula: instrumento.caratula,
            urgencia: instrumento.urgencia,
            domicilio_denunciado: instrumento.domicilio_denunciado,
            juzgadoIdentifier: instrumento.orden.juzgado.identifier,
            instrumentoTypeIdentifier: instrumento.instrumentoType.identifier,
            codigo: instrumento.codigoInstrumento,
            tipoDeCarga: instrumento.cargaInstrumento,
            observaciones: instrumento.observaciones ?? "",
            estado: instrumento.estado,
            punto: (instrumento.latitude && instrumento.longitude) ? [instrumento.latitude, instrumento.longitude] : null,
            zona: zonas.find(
                (zone) => zone.zoneName === instrumento.zoneName
            ) ?? null,
            subZona: instrumento.subZona ?? null
        }

        return instrumentoDto
    }
