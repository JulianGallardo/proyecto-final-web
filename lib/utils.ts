import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
