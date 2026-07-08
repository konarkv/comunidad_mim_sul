import { createClient } from "@/lib/supabase/server";
import { PostComposer } from "@/components/app/PostComposer";
import { fetchNames, nameFor } from "@/lib/names";
import { formatDateTime } from "@/lib/format";
import type { Post } from "@/lib/supabase/types";

export default async function FeedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("posts")
    .select("id, author_id, kind, title, body, created_at")
    .eq("community_id", id)
    .order("created_at", { ascending: false })
    .limit(50);

  const posts = (data ?? []) as Post[];
  const names = await fetchNames(supabase, posts.map((p) => p.author_id));

  return (
    <div className="space-y-6">
      <PostComposer communityId={id} />

      {posts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-bg p-8 text-center text-muted">
          Todavía no hay mensajes. Sé el primero en escribir a la comunidad.
        </p>
      ) : (
        <ul className="space-y-3">
          {posts.map((p) => {
            const author = nameFor(names, p.author_id);
            const initials = author
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();
            return (
              <li
                key={p.id}
                className="rounded-2xl border border-border bg-bg p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">
                    {initials || "V"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="text-sm font-semibold text-ink">
                        {author}
                      </span>
                      {p.kind === "aviso" && (
                        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
                          📌 Aviso
                        </span>
                      )}
                      <span className="text-xs text-muted">
                        {formatDateTime(p.created_at)}
                      </span>
                    </div>
                    {p.title && (
                      <p className="mt-1 font-semibold text-ink">{p.title}</p>
                    )}
                    <p className="mt-1 whitespace-pre-wrap text-[15px] leading-relaxed text-ink">
                      {p.body}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
