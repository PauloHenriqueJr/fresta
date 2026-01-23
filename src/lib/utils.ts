import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildCalendarShareUrl(calendarId: string) {
  const baseUrl = import.meta.env.BASE_URL || "/";

  // Se a base for relativa ou apenas "/", tentamos obter o caminho base real da URL atual.
  // Isso é crucial para o GitHub Pages quando o projeto está em um subdiretório.
  if (baseUrl === "./" || baseUrl === "/") {
    const path = window.location.pathname;
    const base = path.endsWith("/") ? path : path.replace(/\/[^/]*$/, "/");
    return `${window.location.origin}${base}#/c/${calendarId}`;
  }

  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return `${window.location.origin}${normalizedBase}#/c/${calendarId}`;
}
