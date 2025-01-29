import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { DateTime } from "luxon";


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
  console.log("Date", date);

  // Parsear la fecha con Luxon asumiendo el formato "DD/MM/YYYY HH:mm:ss"
  const parsedDate = DateTime.fromFormat(date, "d/M/yyyy HH:mm:ss");

  // Formatear la fecha a "YYYY-MM-DD"
  const formattedDate = parsedDate.toFormat("yyyy-MM-dd");

  console.log(formattedDate);
  return formattedDate;
};