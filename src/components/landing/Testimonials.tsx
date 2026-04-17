import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/services/mock/home.mock";
import { useTranslations } from "next-intl";

export function Testimonials() {
  const t = useTranslations("landing.testimonials");
  return (
    <section className="bg-primary-surface/60 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-12 text-center font-bold text-4xl text-forest md:text-5xl">
          {t("title")}
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-3xl border border-primary-element bg-background p-8 shadow-sm"
            >
              <div className="mb-4 flex gap-1">
                {[...Array(t.stars)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-primary-400 text-primary-400"
                  />
                ))}
              </div>
              <p className="mb-6 font-body text-sm leading-relaxed text-moss/80">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 font-body text-sm font-bold text-white">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-body text-sm font-semibold text-forest">
                    {t.name}
                  </div>
                  <div className="font-body text-xs text-moss/50">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
