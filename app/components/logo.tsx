export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-deep)] shadow-lg shadow-[var(--brand-deep)]/40 border border-[var(--brand-gold)]/40">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--brand-gold)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          {/* A sophisticated bridge / hanger abstract design */}
          <path d="M12 5 Q9 9 4 11 L4 20" />
          <path d="M12 5 Q15 9 20 11 L20 20" />
          <path d="M4 14 L20 14" />
          <circle cx="12" cy="7" r="2" />
        </svg>
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent mix-blend-overlay" />
      </div>
      <span className="heading-font text-xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-2xl">
        DIVINE<span className="text-[var(--brand)]">BRIDGE</span>
      </span>
    </div>
  );
}
