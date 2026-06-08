export function Hero({
  title,
  subtitle,
  emoji = "中",
  kicker = "汉语学习 · تعلُّم الصينية",
}: {
  title: string;
  subtitle: string;
  emoji?: string;
  kicker?: string;
}) {
  return (
    <section className="mx-auto max-w-2xl px-6 pb-7 pt-12 sm:pt-14">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-coral font-cn text-2xl font-black text-white shadow-coral">
          {emoji}
        </div>
        <span className="text-sm font-semibold tracking-wide text-muted">
          {kicker}
        </span>
      </div>

      <h1 className="mb-3 whitespace-pre-line text-[28px] sm:text-[32px] font-extrabold leading-tight tracking-tight text-ink">
        {title}
      </h1>
      <p className="text-[15px] leading-relaxed text-muted">{subtitle}</p>
    </section>
  );
}
