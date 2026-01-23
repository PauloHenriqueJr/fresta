import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildCalendarShareUrl(calendarId: string) {
  const baseUrl = import.meta.env.BASE_URL || "/";
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const currentPath = window.location.pathname;
  const baseFromLocation = currentPath.endsWith("/")
    ? currentPath
    : currentPath.replace(/\/[^/]*$/, "/");
  const base = currentPath.startsWith(normalizedBase)
    ? normalizedBase
    : baseFromLocation;
  return `${window.location.origin}${base}#/c/${calendarId}`;
}
