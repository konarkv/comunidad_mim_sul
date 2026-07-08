export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`flex h-8 w-8 items-center justify-center rounded-lg bg-accent ${className}`}
      aria-hidden
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        {/* three simple "vecinos" dots over a base — community + agreement */}
        <circle cx="7" cy="8" r="2.4" fill="white" />
        <circle cx="17" cy="8" r="2.4" fill="white" />
        <circle cx="12" cy="6" r="2.4" fill="white" />
        <path
          d="M4 18c0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4v1H4v-1z"
          fill="white"
        />
      </svg>
    </span>
  );
}
