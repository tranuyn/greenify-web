"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { Leaf, Eye, EyeOff, Lock, User, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import LOGO_URL from "@/constants/logoUrl";
import { useLogin } from "hooks/mutations/useAuth";

export default function AdminLoginPage() {
  const router = useRouter();
  const t = useTranslations("admin.login");

  const { mutateAsync: loginUser, isPending: loading } = useLogin();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (!identifier.trim() || password.length < 6) {
        throw new Error("Tên đăng nhập/Email hoặc mật khẩu không hợp lệ.");
      }

      await loginUser({ identifier, password });

      // Token đã được lưu vào localStorage trong authService.login().
      // useLogin.onSuccess sẽ invalidate cache 'me' → useCurrentUser refetch
      // → layout xác nhận ADMIN role → điều hướng vào dashboard.
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message ?? "Đăng nhập thất bại.");
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
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl shadow-md shadow-primary-900/50">
              <Image src={LOGO_URL} alt="Greenify Logo" width={40} height={40} />
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

            {/* Identifier */}
            <div>
              <label className="mb-2 block font-body text-xs font-medium uppercase tracking-wider text-primary-content/60">
                Email / Tên đăng nhập
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 dark:text-primary/60 text-primary-500/60"
                />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@greenify.vn hoặc admin"
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
