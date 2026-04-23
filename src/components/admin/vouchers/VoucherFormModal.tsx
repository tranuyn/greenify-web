"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useUpload } from "@/hooks/mutations/useUpload";
import type {
  VoucherTemplate,
  CreateVoucherTemplateRequest,
  UpdateVoucherTemplateRequest,
} from "@/types/gamification.types";
import type { MediaDto } from "@/types/media.types";

type VoucherFormState = {
  name: string;
  partnerName: string;
  description: string;
  requiredPoints: number;
  totalStock: number;
  additionalStock: number;
  usageConditions: string;
  validUntil: string;
};

interface VoucherFormModalProps {
  initial?: VoucherTemplate | null;
  onClose: () => void;
  onSubmit: (
    data: CreateVoucherTemplateRequest | UpdateVoucherTemplateRequest,
  ) => Promise<void> | void;
  isPending: boolean;
}

export function VoucherFormModal({
  initial,
  onClose,
  onSubmit,
  isPending,
}: VoucherFormModalProps) {
  const t = useTranslations("admin.vouchers");
  const isEdit = !!initial;
  const [mounted, setMounted] = useState(false);
  const { mutateAsync: uploadFile, isPending: isUploading } = useUpload();

  const [partnerLogoFile, setPartnerLogoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [partnerLogoPreview, setPartnerLogoPreview] = useState<string | null>(
    initial?.partnerLogoUrl ?? null,
  );
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    initial?.thumbnailUrl ?? null,
  );

  const [form, setForm] = useState<VoucherFormState>({
    name: initial?.name ?? "",
    partnerName: initial?.partnerName ?? "",
    description: initial?.description ?? "",
    requiredPoints: initial?.requiredPoints ?? 0,
    totalStock: initial?.totalStock ?? 0,
    additionalStock: 0,
    usageConditions: initial?.usageConditions ?? "",
    validUntil: initial?.validUntil ? initial.validUntil.slice(0, 10) : "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const set = (k: keyof VoucherFormState, v: string | number) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleFileChange = (
    kind: "partnerLogo" | "thumbnail",
    file: File | null,
  ) => {
    if (kind === "partnerLogo") {
      setPartnerLogoFile(file);
      setPartnerLogoPreview(
        file ? URL.createObjectURL(file) : initial?.partnerLogoUrl ?? null,
      );
      return;
    }

    setThumbnailFile(file);
    setThumbnailPreview(
      file ? URL.createObjectURL(file) : initial?.thumbnailUrl ?? null,
    );
  };

  const uploadSelectedImage = async (
    file: File | null,
    key: "form.partnerLogo" | "form.thumbnail",
  ): Promise<MediaDto | null> => {
    if (!file) return null;

    try {
      return await uploadFile({ file });
    } catch {
      toast.error(t("toast.uploadError", { field: t(key) }));
      throw new Error("UPLOAD_FAILED");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!isEdit && (!partnerLogoFile || !thumbnailFile)) {
        toast.error(t("toast.mediaRequired"));
        return;
      }

      const validUntil = new Date(form.validUntil).toISOString();
      const partnerLogo = await uploadSelectedImage(
        partnerLogoFile,
        "form.partnerLogo",
      );
      const thumbnail = await uploadSelectedImage(
        thumbnailFile,
        "form.thumbnail",
      );

      if (isEdit) {
        const payload: UpdateVoucherTemplateRequest = {
          name: form.name,
          partnerName: form.partnerName,
          description: form.description,
          requiredPoints: form.requiredPoints,
          additionalStock: form.additionalStock,
          usageConditions: form.usageConditions,
          validUntil,
          status: initial?.status,
        };

        if (partnerLogo) {
          payload.partnerLogo = partnerLogo;
        }

        if (thumbnail) {
          payload.thumbnail = thumbnail;
        }

        await onSubmit(payload);
        return;
      }

      const payload: CreateVoucherTemplateRequest = {
        name: form.name,
        partnerName: form.partnerName,
        description: form.description,
        requiredPoints: form.requiredPoints,
        totalStock: form.totalStock,
        usageConditions: form.usageConditions,
        validUntil,
        partnerLogo,
        thumbnail,
      };

      await onSubmit(payload);
    } catch {
      // Toasts are shown by upload helper and parent submit handler.
    }
  };

  const field = (
    label: string,
    key: keyof VoucherFormState,
    opts?: { type?: string; placeholder?: string; multiline?: boolean },
  ) => (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      {opts?.multiline ? (
        <textarea
          value={form[key] as string}
          onChange={(e) => set(key, e.target.value)}
          rows={3}
          placeholder={opts.placeholder}
          className="w-full resize-none rounded-2xl border border-gray-200 bg-card px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-primary-500 focus:bg-card focus:ring-4 focus:ring-primary-500/10"
        />
      ) : (
        <input
          type={opts?.type ?? "text"}
          value={form[key] as string | number}
          onChange={(e) =>
            set(
              key,
              opts?.type === "number" ? Number(e.target.value) : e.target.value,
            )
          }
          placeholder={opts?.placeholder}
          className="w-full rounded-2xl border border-gray-200 bg-card px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-primary-500 focus:bg-card focus:ring-4 focus:ring-primary-500/10"
        />
      )}
    </div>
  );

  const mediaField = (
    label: string,
    id: string,
    fileName: string | null,
    previewUrl: string | null,
    onFileChange: (file: File | null) => void,
  ) => (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-semibold text-gray-500 uppercase tracking-wider"
      >
        {label}
      </label>
      <div className="rounded-2xl border border-gray-200 bg-card p-3">
        <input
          id={id}
          type="file"
          accept="image/*"
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-foreground file:mr-3 file:rounded-xl file:border-0 file:bg-primary-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-primary-700 hover:file:bg-primary-200"
        />
        {fileName && <p className="mt-2 text-xs text-foreground/70">{fileName}</p>}
        {previewUrl && (
          <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-background">
            <img src={previewUrl} alt={label} className="h-28 w-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 ">
      <div
        className="absolute inset-0 bg-primary-950/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative flex max-h-[90vh] w-full max-w-2xl animate-fade-up flex-col overflow-hidden rounded-3xl bg-background shadow-2xl shadow-primary-900/10">
        <div className="flex items-center justify-between border-b border-gray-100 bg-card px-6 py-5">
          <h3 className="text-lg font-bold text-primary-heading">
            {isEdit ? t("form.editTitle") : t("form.createTitle")}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full bg-gray-50 p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <form
          id="voucher-form"
          onSubmit={handleSubmit}
          className="flex-1 space-y-5 overflow-y-auto px-6 py-6"
        >
          {field(t("form.name"), "name", {
            placeholder: t("form.namePlaceholder"),
          })}
          {field(t("form.partner"), "partnerName", {
            placeholder: t("form.partnerPlaceholder"),
          })}
          {field(t("form.description"), "description", {
            multiline: true,
            placeholder: t("form.descPlaceholder"),
          })}

          <div className="grid grid-cols-2 gap-5">
            {field(t("form.points"), "requiredPoints", {
              type: "number",
              placeholder: t("form.pointsPlaceholder"),
            })}
            {isEdit
              ? field(t("form.additionalStock"), "additionalStock", {
                  type: "number",
                  placeholder: t("form.additionalStockPlaceholder"),
                })
              : field(t("form.stock"), "totalStock", {
                  type: "number",
                  placeholder: t("form.stockPlaceholder"),
                })}
          </div>

          {field(t("form.conditions"), "usageConditions", {
            multiline: true,
            placeholder: t("form.condPlaceholder"),
          })}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {mediaField(
              t("form.partnerLogo"),
              "voucher-partner-logo",
              partnerLogoFile?.name ?? null,
              partnerLogoPreview,
              (file) => handleFileChange("partnerLogo", file),
            )}
            {mediaField(
              t("form.thumbnail"),
              "voucher-thumbnail",
              thumbnailFile?.name ?? null,
              thumbnailPreview,
              (file) => handleFileChange("thumbnail", file),
            )}
          </div>

          {field(t("form.validUntil"), "validUntil", { type: "date" })}
        </form>

        <div className="flex items-center gap-3 border-t border-gray-100 bg-card px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            {t("form.cancel")}
          </button>
          <button
            form="voucher-form"
            type="submit"
            disabled={
              isPending ||
              isUploading ||
              !form.name ||
              !form.partnerName ||
              !form.validUntil ||
              (!isEdit && (!partnerLogoFile || !thumbnailFile)) ||
              (!isEdit && form.totalStock <= 0) ||
              (isEdit && form.additionalStock < 0)
            }
            className="flex-1 rounded-2xl bg-primary-600 py-3 text-sm font-bold text-white shadow-md shadow-primary-600/20 transition-all hover:bg-primary-700 hover:shadow-lg disabled:opacity-50 disabled:shadow-none"
          >
            {isUploading
              ? t("form.uploading")
              : isPending
                ? t("form.saving")
                : isEdit
                  ? t("form.save")
                  : t("form.create")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
