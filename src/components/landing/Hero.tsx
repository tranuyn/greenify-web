import { Download as DownloadIcon, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("landing.hero");
  return (
    <section className="relative overflow-hidden bg-background dark:bg-forest pt-24 noise">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-primary-900/30 blur-[100px]" />
        <div className="absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full bg-primary-700/20 blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-32 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex animate-fade-in items-center gap-2 rounded-full border border-primary-700/40 bg-primary-950/70 px-4 py-2 opacity-0">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span className="font-mono text-xs uppercase tracking-widest text-primary">
            {t("badge")}
          </span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up mb-6 font-display text-6xl text-foreground leading-[1.05] opacity-0 delay-100 md:text-8xl">
          {t("headline_1")}
          <br />
          <span className="gradient-text">{t("headline_2")}</span>
        </h1>

        <p className="animate-fade-up mx-auto mb-12 max-w-2xl text-balance font-body text-lg leading-relaxed text-primary-content/90 opacity-0 delay-200">
          {t("description")}
        </p>

        {/* CTAs */}
        <div className="animate-fade-up flex flex-col items-center justify-center gap-4 opacity-0 delay-300 sm:flex-row">
          <a
            href="#download"
            className="group flex items-center gap-3 rounded-2xl bg-primary-500 px-8 py-4 font-body font-semibold text-forest shadow-lg transition-all hover:bg-primary-400"
          >
            <DownloadIcon size={20} />
            {t("download_btn")}
            <ChevronRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </a>
          <a
            href="#features"
            className="flex items-center gap-2 rounded-2xl border border-primary-700/40 px-8 py-4 font-body font-medium text-primary-content transition-all hover:border-primary-hover/80 hover:text-primary-heading"
          >
            {t("explore_btn")}
          </a>
        </div>

        {/* Floating phone mockups */}
        <div className="animate-fade-up relative mx-auto mt-20 max-w-3xl opacity-0 delay-400">
          <div className="flex items-end justify-center gap-6">
            <div
              className="-rotate-6 translate-y-6 opacity-70 animate-float"
              style={{ animationDelay: "0.5s" }}
            >
              <MockPhone color="bg-primary-100 dark:bg-primary-900" />
            </div>
            <div className="relative z-10 shadow-2xl rounded-3xl shadow-primary-950">
              <MockPhone featured color="bg-forest" />
            </div>
            <div
              className="rotate-6 translate-y-6 opacity-70 animate-float"
              style={{ animationDelay: "1s" }}
            >
              <MockPhone color="bg-moss" />
            </div>
          </div>
          <div className="absolute -bottom-6 left-1/2 h-20 w-3/4 -translate-x-1/2 rounded-full bg-primary-500/10 blur-3xl" />
        </div>
      </div>
    </section>
  );
}

function MockPhone({ featured, color }: { featured?: boolean; color: string }) {
  const h = featured ? "h-[380px] w-48" : "h-[320px] w-40";
  return (
    <div
      className={`${h} overflow-hidden rounded-3xl border-4 border-foreground/15 ${color}`}
    >
      {/* Fake screen content */}
      <div className="flex flex-col gap-2 p-3 pt-8">
        <div className="h-12 rounded-2xl bg-primary-100 dark:bg-primary-600/40" />
        <div className="grid grid-cols-4 gap-1.5">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-10 rounded-xl bg-black/5 dark:bg-white/10"
            />
          ))}
        </div>
        <div className="h-2 w-20 rounded bg-black/10 dark:bg-white/20 mt-2" />
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex gap-2">
            <div className="h-14 w-14 shrink-0 rounded-xl bg-black/5 dark:bg-white/10" />
            <div className="flex-1 space-y-1.5 pt-1">
              <div className="h-2 rounded bg-black/10 dark:bg-white/20" />
              <div className="h-2 w-3/4 rounded bg-black/5 dark:bg-white/10" />
              <div className="h-2 w-1/2 rounded bg-black/5 dark:bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
