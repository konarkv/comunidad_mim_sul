"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Community } from "@/lib/supabase/types";

export type FormState = { error?: string };

export async function createCommunity(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const dwellingsRaw = String(formData.get("dwellings") ?? "").trim();

  if (!name) {
    return { error: "Ponle un nombre a la comunidad." };
  }
  if (dwellingsRaw && !/^\d+$/.test(dwellingsRaw)) {
    return { error: "El número de viviendas no es válido." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_community", {
    p_name: name,
    p_dwellings: dwellingsRaw ? parseInt(dwellingsRaw, 10) : null,
  });

  if (error || !data) {
    console.error("create_community failed", error);
    return { error: "No se pudo crear la comunidad. Inténtalo de nuevo." };
  }

  const community = data as unknown as Community;
  redirect(`/app/c/${community.id}`);
}

export async function joinCommunity(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const code = String(formData.get("code") ?? "").trim();

  if (!code) {
    return { error: "Introduce el código de la comunidad." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("join_community", {
    p_code: code,
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("no válido") || msg.includes("no valido")) {
      return { error: "El código no es válido." };
    }
    console.error("join_community failed", error);
    return { error: "No se pudo unir a la comunidad. Inténtalo de nuevo." };
  }

  const community = data as unknown as Community;
  redirect(`/app/c/${community.id}`);
}
