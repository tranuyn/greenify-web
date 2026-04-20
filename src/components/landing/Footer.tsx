import Link from "next/link";
import { Leaf } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import LOGO_URL from "@/constants/logoUrl";

export function Footer() {
  const t = useTranslations("landing.footer");

  return (
    <footer className="border-t border-primary-900/20 bg-forest py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl">
            <Image src={LOGO_URL} alt="Greenify Logo" width={32} height={32} />
          </div>
          <span className="font-bold text-lg text-foreground">Greenify</span>
        </div>
        <p className="font-body text-xs text-primary-content">{t("copyright")}</p>
        <Link
          href="/admin/login"
          className="font-medium text-xs text-primary-content/70 hover:text-primary-content"
        >
          {t("admin")}
        </Link>
      </div>
    </footer>
  );
}
