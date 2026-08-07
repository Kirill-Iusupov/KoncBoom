import Link from "next/link";

interface IButtonProps {
  title: string;
  url: string;
  color?: string;
  bColor?: string;
  /** Render the ghost variant for use on a dark/gradient background */
  dark?: boolean;
}

export const MainPageButton = ({
  title,
  url,
  color,
  dark = false,
}: IButtonProps) => {
  const isPrimary = Boolean(color);

  if (isPrimary) {
    return (
      <Link
        href={`/${url}`}
        className="inline-flex items-center justify-center gap-2 rounded-full px-6! py-3! font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
        style={{ backgroundColor: `#${color}` }}
      >
        {title}
      </Link>
    );
  }

  return (
    <Link
      href={`/${url}`}
      className={
        dark
          ? "inline-flex items-center justify-center gap-1.5 rounded-full px-6! py-3! font-semibold text-white border border-white/40 bg-white/10 transition-all duration-200 hover:bg-white/20 hover:border-white/70 hover:-translate-y-0.5"
          : "inline-flex items-center justify-center gap-1.5 rounded-full px-5! py-2.5! font-semibold text-brand-ink border border-brand-ink/15 bg-white transition-all duration-200 hover:border-brand-ink/40 hover:-translate-y-0.5"
      }
    >
      {title}
      <span aria-hidden className="text-[0.9em]">→</span>
    </Link>
  );
};
