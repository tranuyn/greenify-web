'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import type { CreateLeaderboardPrizeRequest } from '@/types/gamification.types';

interface PrizeFormModalProps {
  vouchers: { id: string; name: string }[];
  onClose: () => void;
  onSubmit: (data: CreateLeaderboardPrizeRequest) => void;
  isPending: boolean;
}

export function PrizeFormModal({
  vouchers,
  onClose,
  onSubmit,
  isPending,
}: PrizeFormModalProps) {
  const t = useTranslations('admin.leaderboard.form');
  
  const [form, setForm] = useState<CreateLeaderboardPrizeRequest>({
    weekStartDate: '',
    lockAt: '',
    nationalVoucherTemplateId: '',
    provincialVoucherTemplateId: '',
  });

  const handleSubmit = () => {
    onSubmit({
      ...form,
      lockAt: new Date(form.lockAt).toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-primary-950/20 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative flex w-full max-w-md animate-fade-up flex-col overflow-hidden rounded-3xl bg-background shadow-2xl shadow-primary-900/10">
        <div className="flex items-center justify-between border-b border-gray-100 bg-card px-6 py-5">
          <h3 className="text-lg font-bold text-primary-heading">
            {t('title')}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full bg-gray-50 p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-5">
          {/* Week start */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              {t('weekStartDate')}
            </label>
            <input
              type="date"
              value={form.weekStartDate}
              onChange={(e) =>
                setForm((p) => ({ ...p, weekStartDate: e.target.value }))
              }
              className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
            />
          </div>

          {/* Lock at */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              {t('lockAt')}
            </label>
            <input
              type="datetime-local"
              value={form.lockAt}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  lockAt: e.target.value,
                }))
              }
              className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
            />
          </div>

          {/* National voucher */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              {t('nationalVoucher')}
            </label>
            <select
              value={form.nationalVoucherTemplateId}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  nationalVoucherTemplateId: e.target.value,
                }))
              }
              className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
            >
              <option value="">{t('selectVoucher')}</option>
              {vouchers.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          {/* Provincial voucher */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              {t('provincialVoucher')}
            </label>
            <select
              value={form.provincialVoucherTemplateId}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  provincialVoucherTemplateId: e.target.value,
                }))
              }
              className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
            >
              <option value="">{t('selectVoucher')}</option>
              {vouchers.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-gray-100 bg-card px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl bg-white border border-gray-200 py-3 text-sm font-semibold text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              isPending ||
              !form.weekStartDate ||
              !form.lockAt ||
              !form.nationalVoucherTemplateId ||
              !form.provincialVoucherTemplateId
            }
            className="flex-1 rounded-2xl bg-primary-600 py-3 text-sm font-bold text-white shadow-md shadow-primary-600/20 transition-all hover:bg-primary-700 hover:shadow-lg disabled:opacity-50 disabled:shadow-none"
          >
            {isPending ? t('saving') : t('submit')}
          </button>
        </div>
      </div>
    </div>
  );
}
