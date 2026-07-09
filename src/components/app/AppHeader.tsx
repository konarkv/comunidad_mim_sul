import Link from "next/link";
import { signOut } from "@/app/auth/actions";
import { Logo } from "@/components/marketing/Logo";

export function AppHeader({ email }: { email?: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/app" className="flex items-center gap-2">
          <Logo />
          <span className="text-lg font-bold text-ink">ConvivAI</span>
        </Link>
        <div className="flex items-center gap-3">
          {email && (
            <span className="hidden text-sm text-muted sm:inline">{email}</span>
          )}
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-ink transition hover:border-accent hover:text-accent"
            >
              Salir
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
