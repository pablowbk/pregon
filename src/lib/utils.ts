import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  });
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);

  if (Math.abs(diffMins) < 60) {
    return diffMins === 0
      ? "ahora"
      : diffMins > 0
      ? `en ${diffMins} min`
      : `hace ${Math.abs(diffMins)} min`;
  }
  if (Math.abs(diffHours) < 24) {
    return diffHours > 0
      ? `en ${diffHours} hora${diffHours > 1 ? "s" : ""}`
      : `hace ${Math.abs(diffHours)} hora${Math.abs(diffHours) > 1 ? "s" : ""}`;
  }
  return diffDays > 0
    ? `en ${diffDays} día${diffDays > 1 ? "s" : ""}`
    : `hace ${Math.abs(diffDays)} día${Math.abs(diffDays) > 1 ? "s" : ""}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

