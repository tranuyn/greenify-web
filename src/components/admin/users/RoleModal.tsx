import { useState } from "react";
import { Check, AlertTriangle, X } from "lucide-react";
import { AdminUserDto, UserRole } from "@/types/user.type";
import { useTranslations } from "next-intl";

const ROLE_OPTS: UserRole[] = ["USER", "CTV", "NGO", "ADMIN"];

const ROLE_CLS: Record<string, string> = {
  USER: "bg-gray-100 text-gray-600",
  CTV: "bg-blue-100 text-blue-700",
  NGO: "bg-violet-100 text-violet-700",
  ADMIN: "bg-amber-100 text-amber-700",
};

export function RoleModal({
  user,
  onClose,
  onSave,
  isPending,
}: {
  user: AdminUserDto;
  onClose: () => void;
  onSave: (role: UserRole) => void;
  isPending: boolean;
}) {
  const t = useTranslations("admin.users.modals.role");
  const tCommon = useTranslations("common");
  
  const currentRole = (user.roles[0] ?? "USER") as UserRole;
  const [selected, setSelected] = useState<UserRole>(currentRole);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 transition-opacity">
      <div className="w-full max-w-sm rounded-3xl bg-card p-6 shadow-2xl animate-fade-up">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-primary">{t("title")}</h3>
            <p className="text-xs text-foreground/70">{user.name}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-gray-100 transition-colors"
          >
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        <div className="space-y-2">
          {ROLE_OPTS.map((role) => (
            <button
              key={role}
              onClick={() => setSelected(role)}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm transition-all ${
                selected === role
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-border hover:border-primary-200 hover:bg-primary-50/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_CLS[role]}`}
                >
                  {tCommon(`roles.${role}`)}
                </span>
                {role === currentRole && (
                  <span className="text-xs text-gray-400">{t("current")}</span>
                )}
              </div>
              {selected === role && (
                <Check size={16} className="text-primary-600" />
              )}
            </button>
          ))}
        </div>

        {/* CTV Demotion Warning */}
        {currentRole === "CTV" && selected !== "CTV" && (
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5">
            <AlertTriangle
              size={14}
              className="mt-0.5 shrink-0 text-amber-500"
            />
            <p className="text-xs text-amber-700">
              {t("ctvWarning")}
            </p>
          </div>
        )}

        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-border py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {tCommon("actions.cancel")}
          </button>
          <button
            onClick={() => onSave(selected)}
            disabled={isPending || selected === currentRole}
            className="flex-1 rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 transition-all shadow-sm shadow-primary-600/20"
          >
            {isPending ? tCommon("actions.processing") : tCommon("actions.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
