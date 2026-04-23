import type { ElementType } from "react";
import { MapPin, CheckCircle, XCircle, Clock, Shield } from "lucide-react";
import type {
  ResolveRequestStatus,
  TrashSpotStatus,
  SeverityTier,
} from "@/types/trashspot.types";

export const RESOLVE_STATUS_META: Record<
  ResolveRequestStatus,
  { cls: string; icon: ElementType }
> = {
  PENDING_ADMIN_REVIEW: {
    cls: "bg-amber-50 text-amber-700 border border-amber-200",
    icon: Clock,
  },
  APPROVED: {
    cls: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    icon: CheckCircle,
  },
  REJECTED: {
    cls: "bg-rose-50 text-rose-600 border border-rose-200",
    icon: XCircle,
  },
};

export const SPOT_STATUS_META: Record<TrashSpotStatus, { cls: string }> = {
  PENDING_VERIFY: {
    cls: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  VERIFIED: {
    cls: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  IN_PROGRESS: {
    cls: "bg-violet-50 text-violet-700 border border-violet-200",
  },
  RESOLVED: {
    cls: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  REOPENED: {
    cls: "bg-orange-50 text-orange-700 border border-orange-200",
  },
};

export const SEVERITY_META: Record<SeverityTier, { cls: string }> = {
  SEVERITY_LOW: {
    cls: "bg-green-50 text-green-700 border border-green-200",
  },
  SEVERITY_MEDIUM: {
    cls: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  SEVERITY_HIGH: {
    cls: "bg-rose-50 text-rose-600 border border-rose-200",
  },
};

export type TrashSpotsTab = "requests" | "spots" | "reports";

export const TABS: {
  key: TrashSpotsTab;
  labelKey: string;
  icon: ElementType;
}[] = [
  { key: "requests", labelKey: "tabs.requests", icon: CheckCircle },
  { key: "spots", labelKey: "tabs.spots", icon: MapPin },
  { key: "reports", labelKey: "tabs.reports", icon: Shield },
];
