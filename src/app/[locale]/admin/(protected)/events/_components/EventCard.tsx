'use client';

import { Eye, CheckCircle, XCircle, Calendar, MapPin, Users, Trophy } from 'lucide-react';
import { Event } from '@/types/community.types';
import { STATUS_CONFIG, EVENT_TYPE_LABELS } from './EventFilterBar';

interface Props {
  event: Event;
  onViewDetail: (e: Event) => void;
  onQuickApprove: (id: string) => void;
  onQuickReject: (id: string) => void;
  isApproving: boolean;
  isRejecting: boolean;
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} · ${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}

export function EventCard({
  event,
  onViewDetail,
  onQuickApprove,
  onQuickReject,
  isApproving,
  isRejecting,
}: Props) {
  const s = STATUS_CONFIG[event.status];
  const isPending = event.status === 'PENDING_APPROVAL';
  const locationLabel = event.address
    ? `${event.address.addressDetail}, ${event.address.ward}`
    : '—';

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      {/* Thumbnail */}
      <div className="relative h-36 bg-primary-50">
        {event.thumbnail?.imageUrl ? (
          <img
            src={event.thumbnail.imageUrl}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-primary-100">
            <span className="text-3xl">🌿</span>
          </div>
        )}

        {/* Status badge */}
        {s && (
          <div className="absolute left-3 top-3">
            <span className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold backdrop-blur-sm ${s.cls}`}>
              <s.icon size={10} />
              {s.label}
            </span>
          </div>
        )}

        {/* Event type badge */}
        <div className="absolute right-3 top-3">
          <span className="rounded-full bg-black/40 px-2.5 py-1 text-[10px] text-white backdrop-blur-sm">
            {EVENT_TYPE_LABELS[event.eventType] ?? event.eventType}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {event.organizer?.name && (
          <p className="text-xs font-medium uppercase tracking-wider text-primary-600">
            {event.organizer.name}
          </p>
        )}
        <h4 className="mt-0.5 line-clamp-1 text-sm font-semibold text-gray-900">
          {event.title}
        </h4>

        <div className="mt-3 space-y-1.5 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar size={11} className="shrink-0" />
            <span>{formatDateTime(event.startTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={11} className="shrink-0" />
            <span className="line-clamp-1">{locationLabel}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Users size={11} /> {event.maxParticipants} người
            </span>
            <span className="flex items-center gap-1">
              <Trophy size={11} /> {event.rewardPoints} GP
            </span>
          </div>
        </div>

        {/* Reject reason nếu có */}
        {event.rejectReason && (
          <p className="mt-2 rounded-lg bg-rose-50 px-3 py-1.5 text-[11px] text-rose-600">
            Lý do từ chối: {event.rejectReason}
          </p>
        )}

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onViewDetail(event)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            <Eye size={13} /> Chi tiết
          </button>

          {isPending && (
            <>
              <button
                onClick={() => onQuickReject(event.id)}
                disabled={isRejecting}
                className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-rose-500 hover:bg-rose-100 disabled:opacity-50"
                title="Từ chối nhanh"
              >
                {isRejecting ? (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-rose-400 border-t-transparent" />
                ) : (
                  <XCircle size={15} />
                )}
              </button>
              <button
                onClick={() => onQuickApprove(event.id)}
                disabled={isApproving}
                className="rounded-xl bg-primary-600 px-3 py-2 text-white hover:bg-primary-700 disabled:opacity-50"
                title="Duyệt nhanh"
              >
                {isApproving ? (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <CheckCircle size={15} />
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}