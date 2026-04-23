import { PaginationParams } from "./common.types";
import { AddressDto } from "./community.types";
import { MediaDto } from "./media.types";

export type UserRole = "USER" | "CTV" | "NGO" | "ADMIN";
export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  DELETED: "DELETED",
  FLAGGED: "FLAGGED",
} as const;

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];
export type AdminUserStatusFilter = UserStatus | "ALL";

export const ADMIN_USER_STATUS_FILTERS: readonly AdminUserStatusFilter[] = [
  "ALL",
  USER_STATUS.ACTIVE,
  USER_STATUS.SUSPENDED,
  USER_STATUS.FLAGGED,
] as const;

export type CtvStatus =
  | "NOT_ELIGIBLE"
  | "ELIGIBLE"
  | "PENDING_UPGRADE"
  | "ACTIVE_CTV"
  | "DOWNGRADED";

export type OtpStatus = "PENDING" | "VERIFIED" | "EXPIRED" | "FAILED";

export type NgoVerifyStatus = "PENDING_VERIFY" | "VERIFIED" | "REJECTED";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  status: UserStatus;
  avatarUrl: string;
  //free_time_slots: FreeTimeSlot[] | null;
}

export interface AdminUserQueryParams extends PaginationParams {
  search?: string;
  status?: AdminUserStatusFilter;
  role?: UserRole | "ALL";
}

export interface AdminUserDto {
  id: string;
  name: string;
  avatarUrl: string | null;
  createdAt: string;
  email: string;
  phoneNumber: string | null;
  roles: UserRole[];
  status: UserStatus;
  availableGreenPoints: number;
  greenPostCount: number;
  suspensionReason: string | null;
}
export interface SuspendUserRequest {
  reason: string;
}

export interface UpdateUserRoleRequest {
  roleName: UserRole;
}

export interface FreeTimeSlot {
  day: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
  from: string; // "08:00"
  to: string; // "12:00"
}

export interface NgoProfile {
  id: string;
  orgName: string;
  representativeName: string;
  hotline: string;
  contactEmail: string;
  description: string;
  status: NgoVerifyStatus;
  rejectedReason: string | null;
  rejectedCount: number;
  address: NgoProfileAddress;
  avatar: MediaDto;
  verificationDocs: MediaDto[];
  createdAt: string;
  updatedAt: string;
}

export interface OtpRequest {
  id: string;
  email: string;
  status: OtpStatus;
  expires_at: string;
  created_at: string;
}

// ---- API Request/Response shapes ----

export interface RegisterEmailRequest {
  identifier: string;
}

export interface VerifyOtpRequest {
  identifier: string;
  otp: string;
}

export interface VerifyOtpResponse {
  verificationToken: string;
}

export interface SetPasswordRequest {
  verificationToken: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  identifier: string; // email hoặc username
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface CompleteProfileRequest {
  firstName?: string;
  lastName?: string;
  displayName: string;
  province: string;
  district?: string;
  ward?: string;
  addressDetail?: string;
  avatar?: {
    bucketName?: string;
    objectKey?: string;
    imageUrl: string;
  };
}

export type NgoProfileAddress = Omit<AddressDto, "id">;

export interface CreateNgoProfileRequest {
  orgName: string;
  representativeName: string;
  hotline: string;
  contactEmail: string;
  description: string;
  address: NgoProfileAddress;
  avatar: MediaDto;
  verificationDocs: Array<MediaDto>;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  roles: UserRole[];
  phoneNumber: string;
  username: string;
  userProfile?: UserProfile;
  ngoProfile?: NgoProfile;
}

export interface CreateUserInput {
  phone: string;
  email: string;
  password: string;
  role?: UserRole;
}
