"use client";

import { Smartphone, ArrowRight, Leaf } from "lucide-react";
import { useTranslations } from "next-intl";

export function Download() {
  const t = useTranslations("landing.download");

  return (
    <section
      id="download"
      className="relative overflow-hidden bg-forest py-28 noise"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-primary-900/40 blur-[80px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-primary-800/30 blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-16 lg:flex-row">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="mb-6 font-semibold text-5xl leading-tight text-foreground md:text-6xl">
              {t("headline_1")}
              <br />
              <span className="gradient-text">{t("headline_2")}</span>
            </h2>
            <p className="mb-10 font-body text-lg text-primary-content/80">
              {t("description")}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              {[
                [t("stores.app_store"), t("platforms.ios")],
                [t("stores.google_play"), t("platforms.android")],
              ].map(([store, platform]) => (
                <a
                  key={store}
                  href="#"
                  className="group flex items-center gap-4 rounded-2xl border border-foreground/10 hover:border-primary-500/40 bg-white/5 dark:hover:bg-white/10 hover:bg-primary/3 px-6 py-4 transition-all"
                >
                  <Smartphone size={28} className="text-foreground" />
                  <div className="text-left">
                    <div className="font-body text-xs text-primary-content">
                      {t("cta_prefix")}
                    </div>
                    <div className="font-body text-base font-semibold text-foreground">
                      {store}
                    </div>
                  </div>
                  <ArrowRight
                    size={16}
                    className="ml-2 text-primary-400 transition-transform group-hover:translate-x-1"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* QR box */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative rounded-3xl border border-white/10 bg-white p-6 shadow-2xl">
              {/* QR pattern placeholder — replace with real QR image */}
              <div className="flex h-48 w-48 flex-col items-center justify-center gap-3 rounded-2xl bg-primary-50">
                <div className="grid grid-cols-6 gap-1.5">
                  {[...Array(36)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-5 w-5 rounded-sm ${
                        [
                          0, 1, 2, 5, 6, 12, 14, 18, 21, 23, 24, 25, 26, 29, 30,
                          31, 32, 35,
                        ].includes(i)
                          ? "bg-forest"
                          : Math.random() > 0.4
                            ? "bg-forest"
                            : "bg-transparent"
                      }`}
                    />
                  ))}
                </div>
                <p className="font-mono text-xs text-primary-600">{t("qr_label")}</p>
              </div>
              {/* Logo overlay */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-primary-600 p-2 shadow-lg">
                <Leaf size={14} className="text-white" />
              </div>
            </div>
            <p className="font-body text-sm text-primary-content/60">{t("qr_instruction")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
