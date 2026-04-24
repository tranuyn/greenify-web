"use client";

import LOGO_URL from "@/constants/logoUrl";
import { Link, usePathname } from "@/i18n/routing";
import { Leaf, Shield, Globe } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";

export function Navbar() {
  const t = useTranslations("landing.navbar");
  const locale = useLocale();
  const pathname = usePathname();
  const nextLocale = locale === "vi" ? "en" : "vi";

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-primary-900/20 bg-forest/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <Image src={LOGO_URL} alt="Greenify Logo" width={40} height={40} />
          <span className="font-bold text-xl text-primary">Greenify</span>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          {[
            ["#features", t("features")],
            ["#stats", t("stats")],
            ["#download", t("download")],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="font-body text-sm font-medium text-foreground transition-colors hover:text-primary-content"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={pathname === "/" ? "/" : pathname}
            locale={nextLocale}
            className="flex items-center gap-1.5 rounded-full border border-primary-border/50 bg-primary-surface/30 px-3 py-2 text-sm font-medium text-primary-content transition-all hover:border-primary-hover hover:text-foreground hover:bg-primary-surface/50"
            title={locale === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
          >
            <Globe size={14} />
            {locale === "vi" ? "EN" : "VI"}
          </Link>

          <Link
            href="/admin/login"
            className="flex items-center gap-2 rounded-full border border-primary-border/50 bg-primary-surface/30 px-4 py-2 text-sm font-medium text-primary-content transition-all hover:border-primary-hover hover:text-foreground hover:bg-primary-surface/50"
          >
            <Shield size={14} /> {t("admin")}
          </Link>
        </div>
      </div>
    </nav>
  );
}
