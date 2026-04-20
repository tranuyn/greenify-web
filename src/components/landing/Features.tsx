import { Leaf } from "lucide-react";
import { FEATURES } from "@/services/mock/home.mock";
import { useTranslations } from "next-intl";
import LOGO_URL from "@/constants/logoUrl";
import Image from "next/image";

export function Features() {
  const t = useTranslations("landing.features");
  return (
    <section id="features" className="bg-background py-18">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-15 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2">
            <Image src={LOGO_URL} alt="Greenify Logo" width={25} height={25} />
            <span className="font-mono text-xs uppercase tracking-wider text-primary-600">
              {t("title")}
            </span>
          </div>
          <h2 className="font-bold text-5xl text-forest md:text-6xl">
            {t("headline_1")}
            <br />
            <span className="text-primary-600">{t("headline_2")}</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-3xl border border-primary-element bg-primary-surface/50 p-8 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-element"
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary-element opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-600/30">
                  <f.icon size={22} />
                </div>
                <h3 className="mb-3 font-display text-xl text-forest">
                  {f.title}
                </h3>
                <p className="font-body text-sm leading-relaxed text-moss/70">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
