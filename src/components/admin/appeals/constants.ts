import type { ElementType } from "react";
import { CheckCircle, Clock, XCircle, FileText } from "lucide-react";
import type { AppealStatus } from "@/types/action.types";

export const PAGE_SIZE = 20;

export const APPEAL_STATUS_META: Record<
  AppealStatus,
  { tone: "warning" | "info" | "success" | "danger"; icon: ElementType }
> = {
  APPEAL_SUBMITTED: {
    tone: "warning",
    icon: Clock,
  },
  UNDER_REVIEW: {
    tone: "info",
    icon: Clock,
  },
  APPEAL_ACCEPTED: {
    tone: "success",
    icon: CheckCircle,
  },
  APPEAL_REJECTED: {
    tone: "danger",
    icon: XCircle,
  },
};

export const APPEAL_DECISION_OPTIONS: readonly Extract<
  AppealStatus,
  "APPEAL_ACCEPTED" | "APPEAL_REJECTED"
>[] = ["APPEAL_ACCEPTED", "APPEAL_REJECTED"] as const;

export const APPEAL_EMPTY_ICON = FileText;
