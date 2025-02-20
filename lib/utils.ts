import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import bcrypt from "bcryptjs";

import { DateTime } from "luxon";
import { EstadoEntrega, EstadoInstrumento } from "@prisma/client";


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
  const dateParsed = DateTime.fromISO(date).setZone("America/Argentina/Buenos_Aires");
  const dateInArgentina = dateParsed.toLocaleString(DateTime.DATE_FULL);
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
    case EstadoInstrumento.PENDIENTE_DE_PROCESAR:
      return 'bg-blue-100 text-blue-800 border-blue-500 hover:bg-blue-400';
    case EstadoInstrumento.ENTREGADO_VERDE:
      return 'bg-green-100 text-green-800 border-green-500 hover:bg-green-400';
    case EstadoInstrumento.ENTREGADO_AMARILLO:
      return 'bg-yellow-100 text-yellow-800 border-yellow-500 hover:bg-yellow-400';
    case EstadoInstrumento.ENTREGADO_ROJO:
      return 'bg-red-100 text-red-800 border-red-500 hover:bg-red-400';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-500';
  }
};

export const getEntregasStatusColor = (estado: EstadoEntrega) => {
  switch (estado) {
      case EstadoEntrega.PENDIENTE_DE_PROCESAR:
          return 'bg-yellow-100 text-yellow-800 border-yellow-500 hover:bg-yellow-400';
      case EstadoEntrega.ENTREGADO:
          return 'bg-green-100 text-green-800 border-green-500 hover:bg-green-400';
      case EstadoEntrega.NO_ENTREGADO:
          return 'bg-red-100 text-red-800 border-red-500 hover:bg-red-400';
      default:
          return 'bg-gray-100 text-gray-800 border-gray-500';
  }
};