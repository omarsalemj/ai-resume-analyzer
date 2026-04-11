import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const KB = 1024;
const MB = KB * 1024;
const GB = MB * 1024;

const formatValue = (value: number) =>
  value >= 10 || Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);

export const formatSize = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 KB";
  }

  if (bytes < MB) {
    return `${formatValue(bytes / KB)} KB`;
  }

  if (bytes < GB) {
    return `${formatValue(bytes / MB)} MB`;
  }

  return `${formatValue(bytes / GB)} GB`;
};

export const generateUUID = () => crypto.randomUUID();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
