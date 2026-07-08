"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { PostKind, VoteChoice } from "@/lib/supabase/types";

export type ActionState = { error?: string; ok?: boolean };

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function createPost(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const communityId = String(formData.get("community_id") ?? "");
  const kind = (String(formData.get("kind") ?? "mensaje") as PostKind) || "mensaje";
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!communityId) return { error: "Comunidad no válida." };
  if (!body) return { error: "Escribe un mensaje." };

  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("posts").insert({
    community_id: communityId,
    author_id: user.id,
    kind: kind === "aviso" ? "aviso" : "mensaje",
    title: title || null,
    body,
  });

  if (error) {
    console.error("createPost failed", error);
    return { error: "No se pudo publicar. Inténtalo de nuevo." };
  }

  revalidatePath(`/app/c/${communityId}`);
  return { ok: true };
}

export async function createProposal(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const communityId = String(formData.get("community_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!communityId) return { error: "Comunidad no válida." };
  if (!title) return { error: "Ponle un título a la propuesta." };

  const { supabase, user } = await requireUser();
  const { data, error } = await supabase
    .from("proposals")
    .insert({
      community_id: communityId,
      author_id: user.id,
      title,
      description: description || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("createProposal failed", error);
    return { error: "No se pudo crear la propuesta. Inténtalo de nuevo." };
  }

  revalidatePath(`/app/c/${communityId}/votaciones`);
  redirect(`/app/c/${communityId}/votaciones/${data.id}`);
}

export async function castVote(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const communityId = String(formData.get("community_id") ?? "");
  const proposalId = String(formData.get("proposal_id") ?? "");
  const choice = String(formData.get("choice") ?? "") as VoteChoice;

  if (!proposalId || !["si", "no", "abstencion"].includes(choice)) {
    return { error: "Voto no válido." };
  }

  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("votes").upsert(
    {
      proposal_id: proposalId,
      user_id: user.id,
      choice,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "proposal_id,user_id" },
  );

  if (error) {
    console.error("castVote failed", error);
    return { error: "No se pudo registrar tu voto." };
  }

  revalidatePath(`/app/c/${communityId}/votaciones/${proposalId}`);
  return { ok: true };
}

export async function closeProposal(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const communityId = String(formData.get("community_id") ?? "");
  const proposalId = String(formData.get("proposal_id") ?? "");

  if (!proposalId) return { error: "Propuesta no válida." };

  const { supabase } = await requireUser();
  const { error } = await supabase.rpc("close_proposal", {
    p_proposal: proposalId,
  });

  if (error) {
    console.error("close_proposal failed", error);
    const msg = error.message.toLowerCase();
    if (msg.includes("autor") || msg.includes("junta")) {
      return { error: "Solo el autor o la junta pueden cerrar la votación." };
    }
    return { error: "No se pudo cerrar la votación." };
  }

  revalidatePath(`/app/c/${communityId}/votaciones/${proposalId}`);
  revalidatePath(`/app/c/${communityId}/actas`);
  return { ok: true };
}
