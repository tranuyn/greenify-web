import { X } from "lucide-react";
import { AdminUserDto, UserStatus } from "@/types/user.type";
import { useTranslations } from "next-intl";
import { UserAvatar } from "@/components/admin/users/UserAvatar";

const STATUS_CFG: Record<UserStatus, string> = {
  ACTIVE: "bg-primary-100 text-primary-content",
  SUSPENDED: "bg-rose-100 text-rose-600",
  FLAGGED: "bg-orange-100 text-orange-600",
  DELETED: "bg-gray-100 text-gray-500",
};

export function UserDetailModal({
  user,
  onClose,
}: {
  user: AdminUserDto;
  onClose: () => void;
}) {
  const t = useTranslations("admin.users.modals.detail");
  const tCommon = useTranslations("common");

  const sCls = STATUS_CFG[user.status];
  const sLabel = tCommon(`status.${user.status}`);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 transition-opacity">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-card shadow-2xl animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-card/50">
          <h3 className="text-lg font-bold text-primary-heading">
            {t("title")}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-gray-200 transition-colors"
          >
             <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-6">
          {/* Avatar + name */}
          <div className="flex flex-col items-center gap-3 text-center">
            <UserAvatar
              name={user.name}
              avatarUrl={user.avatarUrl}
              sizeClassName="h-20 w-20"
              textClassName="text-3xl"
              className="shadow-inner"
            />
            <div>
              <p className="text-xl font-semibold text-primary">{user.name}</p>
              <p className="text-sm text-foreground/70">{user.email}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${sCls}`}
            >
              {sLabel}
            </span>
          </div>

          {/* Info list */}
          <div className="space-y-3 rounded-2xl border border-gray-100 bg-card p-5">
            {[
              { label: t("phone"), value: user.phoneNumber || "—" },
              { label: t("roles"), value: user.roles.map(r => tCommon(`roles.${r}`)).join(", ") },
              { label: t("points"), value: `${user.availableGreenPoints.toLocaleString()} GP` },
              { label: t("posts"), value: `${user.greenPostCount.toLocaleString()}` },
              { label: t("joined"), value: formatDate(user.createdAt) },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-foreground/70 font-medium">{label}</span>
                <span className="text-sm font-semibold text-foreground">
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Suspension reason */}
          {user.suspensionReason && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-4">
              <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-rose-700">
                {t("suspensionReason")}
              </p>
              <p className="text-sm text-rose-600 font-medium leading-relaxed">{user.suspensionReason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
