"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { Leaf, Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AdminLoginPage() {
  const router = useRouter();
  const t = useTranslations("admin.login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // TODO: thay bằng real API call
      // const res = await fetch('/api/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      // Mock: accept any @greenify.vn email
      await new Promise((r) => setTimeout(r, 800));

      if (!email.includes("@") || password.length < 6) {
        throw new Error("Email hoặc mật khẩu không đúng.");
      }

      // Set cookie (real: server sets httpOnly cookie)
      document.cookie = `admin_token=mock_token; path=/; max-age=${60 * 60 * 24}`;
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Đăng nhập thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 noise">
      {/* BG glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary-100/80 dark:bg-primary-900/40 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-primary-200/50 dark:bg-primary-800/30 blur-[80px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-primary-border/40 bg-white/70 shadow-primary-900/20 dark:border-white/10 dark:bg-white/5 dark:shadow-black/40 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="border-b border-white/10 px-8 py-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500 shadow-lg shadow-primary-900/50">
              <Leaf size={24} className="text-forest" />
            </div>
            <h1 className="font-bold text-3xl text-foreground">
              Greenify Admin
            </h1>
            <p className="mt-2 font-body text-sm text-primary-content/70">
              Đăng nhập để quản lý hệ thống
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3">
                <AlertCircle size={16} className="shrink-0 text-rose-400" />
                <p className="font-body text-sm text-rose-300">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="mb-2 block font-body text-xs font-medium uppercase tracking-wider text-primary-content/60">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 dark:text-primary/60 text-primary-500/60"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@greenify.vn"
                  required
                  className="w-full rounded-2xl border border-foreground/10 bg-foreground/5 py-3.5 pl-11 pr-4 font-body text-sm text-foreground placeholder-primary-content/30 outline-none transition-all focus:border-primary-500/50 focus:bg-foreground/8"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block font-body text-xs font-medium uppercase tracking-wider text-primary-content/60">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 dark:text-primary/60 text-primary-500/60"
                />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-2xl border border-foreground/10 bg-foreground/5 py-3.5 pl-11 pr-12 font-body text-sm text-foreground placeholder-primary-content/30 outline-none transition-all focus:border-primary-500/50 focus:bg-foreground/8"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 dark:text-primary/60 text-primary/60 hover:text-primary-content/80"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-body font-semibold text-forest shadow-lg shadow-primary-element/50 transition-all hover:bg-primary-400 disabled:opacity-60"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-forest border-t-transparent" />
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center font-body text-xs text-primary-content/30">
          Chỉ dành cho quản trị viên được phân quyền
        </p>
      </div>
    </div>
  );
}
