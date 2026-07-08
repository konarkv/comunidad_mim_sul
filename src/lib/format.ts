import type { Role, VoteChoice } from "./supabase/types";

export function roleLabel(role: string | null | undefined): string {
  switch (role) {
    case "presidente":
      return "Presidente";
    case "miembro_junta":
      return "Miembro de junta";
    case "administrador":
      return "Administrador";
    case "vecino":
    default:
      return "Vecino";
  }
}

export function isBoard(role: Role | string | null | undefined): boolean {
  return role === "presidente" || role === "miembro_junta";
}

export function choiceLabel(choice: VoteChoice | string): string {
  switch (choice) {
    case "si":
      return "Sí";
    case "no":
      return "No";
    case "abstencion":
      return "Abstención";
    default:
      return choice;
  }
}

export function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function formatDateTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
