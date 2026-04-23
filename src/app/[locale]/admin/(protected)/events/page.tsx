"use client";

import { useState, useMemo } from "react";
import { Calendar } from "lucide-react";
import { Event, EventStatus } from "@/types/community.types";
import { useEvents } from "@/hooks/queries/useEvents";
import { useApproveEvent, useRejectEvent } from "@/hooks/mutations/useEvents";
import { EventFilterBar } from "./_components/EventFilterBar";
import { EventCard } from "./_components/EventCard";
import { EventDetailModal } from "./_components/EventDetailModal";

export default function EventsAdminPage() {
  const [statusFilter, setStatusFilter] = useState<EventStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Fetch tất cả events — dùng useEvents (không lọc status để có đủ data cho count badges)
  const { data, isLoading, isFetching } = useEvents({
    title: appliedSearch.trim() || undefined,
    // Không truyền status để lấy tất cả, filter ở client
    // Khi BE sẵn sàng phân trang, chuyển status filter xuống đây
  });

  const allEvents = useMemo(() => data?.content ?? [], [data]);

  // Client-side filter theo status tab
  const filteredEvents = useMemo(() => {
    if (statusFilter === "ALL") return allEvents;
    return allEvents.filter((e) => e.status === statusFilter);
  }, [allEvents, statusFilter]);

  // Count badges cho mỗi tab
  const counts = useMemo(() => {
    const c: Partial<Record<EventStatus | "ALL", number>> = {
      ALL: allEvents.length,
    };
    allEvents.forEach((e) => {
      c[e.status] = (c[e.status] ?? 0) + 1;
    });
    return c;
  }, [allEvents]);

  // Mutations
  const {
    mutate: approveEvent,
    isPending: isApproving,
    variables: approvingId,
  } = useApproveEvent();
  const {
    mutate: rejectEvent,
    isPending: isRejecting,
    variables: rejectingVars,
  } = useRejectEvent();

  const handleApprove = (id: string) => {
    approveEvent(id, {
      onSuccess: () => setSelectedEvent(null),
    });
  };

  const handleReject = (id: string, reason: string) => {
    rejectEvent(
      { eventId: id, payload: { reason } },
      { onSuccess: () => setSelectedEvent(null) },
    );
  };

  const pendingCount = counts["APPROVAL_WAITING"] ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-header">Sự kiện NGO</h2>
        <p className="mt-1 text-sm text-gray-500">
          {pendingCount > 0 ? (
            <span className="font-semibold text-amber-600">
              {pendingCount} sự kiện đang chờ duyệt
            </span>
          ) : (
            "Không có sự kiện nào chờ duyệt"
          )}
        </p>
      </div>

      {/* Filter bar */}
      <EventFilterBar
        activeStatus={statusFilter}
        onStatusChange={setStatusFilter}
        searchValue={search}
        onSearchChange={setSearch}
        onSearchSubmit={setAppliedSearch}
        isSearching={isFetching}
        counts={counts}
      />

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
        </div>
      )}

      {/* Grid */}
      {!isLoading && filteredEvents.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              onViewDetail={setSelectedEvent}
              onQuickApprove={handleApprove}
              onQuickReject={(id) => handleReject(id, "Từ chối nhanh")}
              isApproving={isApproving && approvingId === evt.id}
              isRejecting={isRejecting && rejectingVars?.eventId === evt.id}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredEvents.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24">
          <Calendar size={40} className="mb-4 text-primary-200" />
          <p className="text-gray-500">
            {appliedSearch
              ? `Không tìm thấy sự kiện nào với "${appliedSearch}"`
              : "Không có sự kiện nào."}
          </p>
        </div>
      )}

      {/* Detail modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          isApproving={isApproving && approvingId === selectedEvent.id}
          isRejecting={
            isRejecting && rejectingVars?.eventId === selectedEvent.id
          }
        />
      )}
    </div>
  );
}
