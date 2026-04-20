// ============================================================
// TRASH SPOT TYPES  (admin + NGO + public)
// Base URL: /api/v1/admin/trash-spots
// ============================================================

// ---- Status / Severity enums --------------------------------

export type TrashSpotStatus =
  | "PENDING_VERIFY"
  | "VERIFIED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "REOPENED";

export type SeverityTier =
  | "SEVERITY_LOW"
  | "SEVERITY_MEDIUM"
  | "SEVERITY_HIGH";

export type ResolveRequestStatus =
  | "PENDING_ADMIN_REVIEW"
  | "APPROVED"
  | "REJECTED";

// ---- Shared sub-shapes --------------------------------------

/** Verification record embedded in TrashSpotDetailDto */
export interface TrashSpotVerification {
  id: string;
  verifierId: string;
  verifierDisplayName: string;
  note: string;
  createdAt: string;
}

/** Resolve-request DTO — returned standalone or embedded in detail */
export interface ResolveRequestDto {
  id: string;
  trashSpotId: string;
  ngoId: string;
  ngoDisplayName: string;
  description: string;
  cleanedAt: string;
  status: ResolveRequestStatus;
  rejectReason: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  imageUrls: string[];
  createdAt: string;
}

// ---- Trash-spot summary (list view) -------------------------

export interface TrashSpotSummaryDto {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  location: string;
  province: string;
  status: TrashSpotStatus;
  severityTier: SeverityTier;
  hotScore: number;
  verificationCount: number;
  primaryImageUrl: string;
  wasteTypeNames: string[];
  createdAt: string;
}

// ---- Trash-spot full detail (GET /trash-spots/{id}) ---------

export interface TrashSpotDetailDto extends TrashSpotSummaryDto {
  reporterId: string;
  reporterDisplayName: string;
  description: string;
  assignedNgoId: string | null;
  assignedNgoDisplayName: string | null;
  claimedAt: string | null;
  resolvedAt: string | null;
  imageUrls: string[];
  wasteTypeIds: string[];
  verifications: TrashSpotVerification[];
  resolveRequests: ResolveRequestDto[];
  lastModifiedAt: string;
}

// ---- Admin reports list item --------------------------------

export interface AdminTrashReportDto {
  id: string;
  trashSpot: TrashSpotSummaryDto;
  reporterId: string;
  reporterDisplayName: string;
  reporterAvatarUrl: string;
  note: string;
  createdAt: string;
  lastModifiedAt: string;
}

// ---- Query params -------------------------------------------

export interface AdminTrashSpotsParams {
  status?: TrashSpotStatus;
  province?: string;
  severityTier?: SeverityTier;
  severity?: SeverityTier;
  wasteTypeId?: string;
  page?: number;
  size?: number;
}

export interface AdminResolveRequestsParams {
  status?: ResolveRequestStatus;
  page?: number;
  size?: number;
}

export interface AdminTrashReportsParams {
  page?: number;
  size?: number;
}

// ---- Request bodies -----------------------------------------

export interface RejectResolveRequestBody {
  rejectReason: string;
}
