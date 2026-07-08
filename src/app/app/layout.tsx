import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/app/AppHeader";

// The product area is per-request (auth + cookies) — never prerender it.
export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/app");
  }

  return (
    <div className="min-h-screen bg-surface">
      <AppHeader email={user.email} />
      {children}
    </div>
  );
}
