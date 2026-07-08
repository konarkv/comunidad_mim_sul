"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function CommunityTabs({ communityId }: { communityId: string }) {
  const pathname = usePathname();
  const base = `/app/c/${communityId}`;

  const tabs = [
    { href: base, label: "Tablón", exact: true },
    { href: `${base}/votaciones`, label: "Votaciones", exact: false },
    { href: `${base}/actas`, label: "Actas", exact: false },
  ];

  return (
    <nav className="flex gap-1 border-b border-border">
      {tabs.map((t) => {
        const active = t.exact
          ? pathname === t.href
          : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`-mb-px border-b-2 px-4 py-3 text-sm font-medium transition ${
              active
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
