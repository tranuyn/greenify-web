'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Plus, Pencil, ToggleLeft, ToggleRight,
  Package, Coins, Clock, AlertCircle, CheckCircle, X,
} from 'lucide-react';
import { useCreateVoucher, useUpdateVoucher, useUpdateVoucherStatus } from '@/hooks/mutations/useAdmin';
import type { VoucherTemplate, VoucherTemplateStatus, CreateVoucherTemplateRequest } from '@/types/gamification.types';
import { useAvailableVouchers } from '@/hooks/queries/useGamification';
import { VoucherFormModal } from '@/components/admin/vouchers/VoucherFormModal';

const getStatusIcon = (status: VoucherTemplateStatus) => {
  switch (status) {
    case 'ACTIVE': return CheckCircle;
    case 'INACTIVE': return AlertCircle;
    case 'EXPIRED': return X;
    case 'DEPLETED': return Package;
    case 'DRAFT':
    default:
      return Clock;
  }
};

const getStatusCls = (status: VoucherTemplateStatus) => {
  switch (status) {
    case 'ACTIVE': return 'bg-primary-100 text-primary-content';
    case 'INACTIVE': return 'bg-amber-50 text-amber-600 border border-amber-200/50';
    case 'EXPIRED': return 'bg-rose-50 text-rose-500 border border-rose-200/50';
    case 'DEPLETED': return 'bg-orange-50 text-orange-500 border border-orange-200/50';
    case 'DRAFT':
    default:
      return 'bg-gray-100 text-gray-500 border border-gray-200';
  }
};



export default function VouchersAdminPage() {
  const t = useTranslations('admin.vouchers');
  
  const { data, isLoading } = useAvailableVouchers();
  const vouchers = data?.content || [];

  const { mutate: createVoucher, isPending: isCreating } = useCreateVoucher();
  const { mutate: updateVoucher, isPending: isUpdating } = useUpdateVoucher();
  const { mutate: updateStatus } = useUpdateVoucherStatus();

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<VoucherTemplate | null>(null);
  const [statusFilter, setStatusFilter] = useState<VoucherTemplateStatus | 'ALL'>('ALL');

  const filtered = statusFilter === 'ALL'
    ? vouchers
    : vouchers.filter((v) => v.status === statusFilter);

  const counts: Partial<Record<VoucherTemplateStatus | 'ALL', number>> = {
    ALL: vouchers.length,
  };
  vouchers.forEach((v) => { counts[v.status] = (counts[v.status] ?? 0) + 1; });

  const handleSubmit = (data: CreateVoucherTemplateRequest) => {
    if (editTarget) {
      updateVoucher({ id: editTarget.id, payload: data }, { onSuccess: closeForm });
    } else {
      createVoucher(data, { onSuccess: closeForm });
    }
  };

  const closeForm = () => { setShowForm(false); setEditTarget(null); };

  const toggleStatus = (v: VoucherTemplate) => {
    const next: VoucherTemplateStatus = v.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    updateStatus({ id: v.id, payload: { status: next } });
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary-heading tracking-tight">{t('title')}</h2>
          <p className="mt-1.5 font-medium text-sm text-gray-500">{t('subtitle', { count: vouchers.length })}</p>
        </div>
        <button
          onClick={() => { setEditTarget(null); setShowForm(true); }}
          className="flex items-center gap-2 rounded-2xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-all hover:bg-primary-700 hover:shadow-lg"
        >
          <Plus size={18} /> {t('createBtn')}
        </button>
      </div>

      {/* Status filter */}
      <div className="scrollbar-hide flex flex-wrap gap-2 overflow-x-auto pb-2">
        {(['ALL', 'ACTIVE', 'INACTIVE', 'DRAFT', 'DEPLETED', 'EXPIRED'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all ${
              statusFilter === s
                ? 'border-primary-500 bg-primary-600 text-white shadow-sm shadow-primary-600/20'
                : 'border-border bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {t(`status.${s}`)}
            <span className={`rounded-full px-2 py-0.5 font-mono text-[11px] font-semibold ${
              statusFilter === s ? 'bg-black/20 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {counts[s] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">{t('table.voucher')}</th>
                  <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">{t('table.partner')}</th>
                  <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">{t('table.points')}</th>
                  <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">{t('table.stock')}</th>
                  <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">{t('table.validUntil')}</th>
                  <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">{t('table.status')}</th>
                  <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs text-right">{t('table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((v) => {
                  const sLabel = t(`status.${v.status}`);
                  const stockPct = v.totalStock > 0 ? Math.round((v.remainingStock / v.totalStock) * 100) : 0;
                  const Icon = getStatusIcon(v.status);
                  
                  return (
                    <tr key={v.id} className="transition-colors hover:bg-gray-50/50">
                      <td className="px-6 py-5">
                        <p className="font-semibold text-gray-900">{v.name}</p>
                        <p className="mt-1 max-w-[200px] truncate text-xs text-gray-500">{v.description}</p>
                      </td>
                      <td className="px-6 py-5 font-medium text-gray-600">{v.partnerName}</td>
                      <td className="px-6 py-5">
                        <span className="flex w-fit items-center gap-1.5 rounded-lg bg-green-50 px-2 py-1 text-xs font-bold text-green-700 border border-green-200/50">
                          <Coins size={14} /> {v.requiredPoints} GP
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-xs font-medium text-gray-500">
                            <span>{v.remainingStock}</span>
                            <span className="text-gray-400">/ {v.totalStock}</span>
                          </div>
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className={`h-full rounded-full transition-all ${
                                stockPct > 50 ? 'bg-primary-500'
                                : stockPct > 20 ? 'bg-amber-400'
                                : 'bg-rose-500'
                              }`}
                              style={{ width: `${Math.min(stockPct, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 font-medium text-gray-600">{formatDate(v.validUntil)}</td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusCls(v.status)}`}>
                          <Icon size={12} /> {sLabel}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          {(v.status === 'ACTIVE' || v.status === 'INACTIVE') && (
                            <button
                              onClick={() => toggleStatus(v)}
                              title={v.status === 'ACTIVE' ? t('toggleDeactivate') : t('toggleActivate')}
                              className={`rounded-xl p-2.5 transition-colors ${
                                v.status === 'ACTIVE'
                                  ? 'text-primary-700 bg-primary-50 hover:bg-primary-100'
                                  : 'text-gray-500 bg-gray-50 hover:bg-gray-200'
                              }`}
                            >
                              {v.status === 'ACTIVE' ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                            </button>
                          )}
                          <button
                            onClick={() => { setEditTarget(v); setShowForm(true); }}
                            className="rounded-xl bg-gray-50 p-2.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900"
                            title={t('edit')}
                          >
                            <Pencil size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 mb-4 animate-float">
                  <Package size={32} className="text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{t('empty')}</h3>
                <p className="mt-1.5 text-sm text-gray-500">
                { 
                  statusFilter !== 'ALL'
                    ? `Không tìm thấy voucher nào đang ${String(t(`status.${statusFilter}`)).toLowerCase()}.`
                    : 'Hãy tạo voucher mới để bắt đầu.'
                }                
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {showForm && (
        <VoucherFormModal
          initial={editTarget}
          onClose={closeForm}
          onSubmit={handleSubmit}
          isPending={isCreating || isUpdating}
        />
      )}
    </div>
  );
}