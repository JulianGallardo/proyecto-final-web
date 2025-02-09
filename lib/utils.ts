import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import bcrypt from "bcryptjs";

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
  const parsedDate = DateTime.fromFormat(date, "d/M/yyyy HH:mm:ss");
  const formattedDate = parsedDate.toFormat("yyyy-MM-dd");
  return formattedDate;
};

export const hashPassword = async (password: string) => {
  const saltNumber = 10;
  const hash = await bcrypt.hash(password, saltNumber);
  return hash;
}