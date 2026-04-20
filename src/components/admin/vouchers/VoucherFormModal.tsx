'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import type {
  VoucherTemplate,
  CreateVoucherTemplateRequest,
  UpdateVoucherTemplateRequest,
} from '@/types/gamification.types';

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
  onSubmit: (data: CreateVoucherTemplateRequest | UpdateVoucherTemplateRequest) => void;
  isPending: boolean;
}

export function VoucherFormModal({
  initial,
  onClose,
  onSubmit,
  isPending,
}: VoucherFormModalProps) {
  const t = useTranslations('admin.vouchers');
  const isEdit = !!initial;
  
  const [form, setForm] = useState<VoucherFormState>({
    name:             initial?.name ?? '',
    partnerName:      initial?.partnerName ?? '',
    description:      initial?.description ?? '',
    requiredPoints:   initial?.requiredPoints ?? 0,
    totalStock:       initial?.totalStock ?? 0,
    additionalStock:  0,
    usageConditions:  initial?.usageConditions ?? '',
    validUntil:       initial?.validUntil ? initial.validUntil.slice(0, 10) : '',
  });

  const set = (k: keyof VoucherFormState, v: string | number) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validUntil = new Date(form.validUntil).toISOString();

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
      onSubmit(payload);
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
    };

    onSubmit(payload);
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
          className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
        />
      ) : (
        <input
          type={opts?.type ?? 'text'}
          value={form[key] as string | number}
          onChange={(e) =>
            set(key, opts?.type === 'number' ? Number(e.target.value) : e.target.value)
          }
          placeholder={opts?.placeholder}
          className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
        />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-primary-950/20 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative flex max-h-[90vh] w-full max-w-lg animate-fade-up flex-col overflow-hidden rounded-3xl bg-background shadow-2xl shadow-primary-900/10">
        <div className="flex items-center justify-between border-b border-gray-100 bg-card px-6 py-5">
          <h3 className="text-lg font-bold text-primary-heading">
            {isEdit ? t('form.editTitle') : t('form.createTitle')}
          </h3>
          <button onClick={onClose} className="rounded-full bg-gray-50 p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <form id="voucher-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {field(t('form.name'), 'name', { placeholder: t('form.namePlaceholder') })}
          {field(t('form.partner'), 'partnerName', { placeholder: t('form.partnerPlaceholder') })}
          {field(t('form.description'), 'description', { multiline: true, placeholder: t('form.descPlaceholder') })}

          <div className="grid grid-cols-2 gap-5">
            {field(t('form.points'), 'requiredPoints', { type: 'number', placeholder: t('form.pointsPlaceholder') })}
            {isEdit
              ? field(t('form.additionalStock'), 'additionalStock', {
                  type: 'number',
                  placeholder: t('form.additionalStockPlaceholder'),
                })
              : field(t('form.stock'), 'totalStock', {
                  type: 'number',
                  placeholder: t('form.stockPlaceholder'),
                })}
          </div>

          {field(t('form.conditions'), 'usageConditions', {
            multiline: true,
            placeholder: t('form.condPlaceholder'),
          })}
          {field(t('form.validUntil'), 'validUntil', { type: 'date' })}
        </form>

        <div className="flex items-center gap-3 border-t border-gray-100 bg-card px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl bg-white border border-gray-200 py-3 text-sm font-semibold text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            {t('form.cancel')}
          </button>
          <button
            form="voucher-form"
            type="submit"
            disabled={
              isPending ||
              !form.name ||
              !form.partnerName ||
              !form.validUntil ||
              (!isEdit && form.totalStock <= 0) ||
              (isEdit && form.additionalStock < 0)
            }
            className="flex-1 rounded-2xl bg-primary-600 py-3 text-sm font-bold text-white shadow-md shadow-primary-600/20 transition-all hover:bg-primary-700 hover:shadow-lg disabled:opacity-50 disabled:shadow-none"
          >
            {isPending ? t('form.saving') : isEdit ? t('form.save') : t('form.create')}
          </button>
        </div>
      </div>
    </div>
  );
}
