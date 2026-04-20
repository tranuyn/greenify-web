import { User, UserProfile, NgoProfile, AuthenticatedUser, LoginResponse, AdminUserDto } from 'types/user.type';

export const MOCK_USER: User = {
  id: 'usr-001',
  phone: '0901234567',
  email: 'uyen@greenify.vn',
  role: 'CTV',
  status: 'ACTIVE',
  ctv_status: 'NOT_ELIGIBLE',
  created_at: '2026-01-10T08:00:00Z',
};

export const MOCK_CTV_USER: User = {
  id: 'usr-002',
  phone: '0912345678',
  email: 'ctv@greenify.vn',
  role: 'CTV',
  status: 'ACTIVE',
  ctv_status: 'ACTIVE_CTV',
  created_at: '2025-11-01T08:00:00Z',
};

export const MOCK_NGO_USER: User = {
  id: 'usr-003',
  phone: '0923456789',
  email: 'ngo@greenfuture.vn',
  role: 'NGO',
  status: 'ACTIVE',
  ctv_status: 'NOT_ELIGIBLE',
  created_at: '2025-09-15T08:00:00Z',
};

export const MOCK_USER_PROFILE: UserProfile = {
  id: 'prof-001',
  firstName: 'Nhã',
  lastName: 'Uyên',
  displayName: 'Nhã Uyên',
  avatarUrl: 'https://i.redd.it/ya8qikz9kn0f1.png',
  province: 'TP. Hồ Chí Minh',
  district: 'Quận 1',
  ward: 'Phường Bến Nghé',
  addressDetail: '123 ABC',
  status: 'ACTIVE',
};

export const MOCK_NGO_PROFILE: NgoProfile = {
  id: 'ngo-prof-001',
  orgName: 'Green Future Vietnam',
  representativeName: 'Nguyễn Văn An',
  hotline: '1800 1234',
  contactEmail: 'contact@greenfuture.vn',
  description: 'Tổ chức phi lợi nhuận hoạt động vì môi trường xanh tại Việt Nam.',
  status: 'VERIFIED',
  rejectedReason: null,
  rejectedCount: 0,
  address: {
    province: 'TP. Hồ Chí Minh',
    district: 'Quận 1',
    ward: 'Phường Bến Nghé',
    addressDetail: '',
    latitude: 10.7769,
    longitude: 106.7009,
  },
  avatar: { bucketName: '', objectKey: '', imageUrl: 'https://mms.img.susercontent.com/e1bec8e5aeda4b7c25c84297aa780d3c' },
  verificationDocs: [],
  createdAt: '2025-09-15T08:00:00Z',
  updatedAt: '2025-09-15T08:00:00Z',
};

export const MOCK_AUTH_RESPONSE: LoginResponse = {
  access_token: 'mock.access.token.eyJhbGciOiJIUzI1NiJ9',
  refresh_token: 'mock.refresh.token.eyJhbGciOiJIUzI1NiJ9',
} as LoginResponse;

export const MOCK_AUTHENTICATED_USER: AuthenticatedUser = {
  id: 'usr-001',
  email: 'uyen@greenify.vn',
  roles: ['CTV'],
  phoneNumber: '0901234567',
  username: 'nhauyen',
  userProfile: MOCK_USER_PROFILE,
};
// export const MOCK_AUTHENTICATED_USER: AuthenticatedUser = {
//   user: MOCK_NGO_USER,
//   profile: MOCK_NGO_PROFILE,
// };
export const MOCK_ADMIN_USERS: AdminUserDto[] = [
  {
    id: 'u1', name: 'Nguyễn Nhã Uyên', avatarUrl: null,
    createdAt: '2026-01-10T00:00:00Z', email: 'uyen@greenify.vn',
    phoneNumber: '0901234567', roles: ['USER'], status: 'ACTIVE',
    availableGreenPoints: 290, greenPostCount: 12, suspensionReason: null,
  },
  {
    id: 'u2', name: 'Trần Minh Thiện', avatarUrl: null,
    createdAt: '2026-01-15T00:00:00Z', email: 'thien@dev.vn',
    phoneNumber: '0912345678', roles: ['CTV'], status: 'ACTIVE',
    availableGreenPoints: 580, greenPostCount: 34, suspensionReason: null,
  },
  {
    id: 'u3', name: 'Green Future VN', avatarUrl: null,
    createdAt: '2026-01-20T00:00:00Z', email: 'ngo@greenfuture.vn',
    phoneNumber: null, roles: ['NGO'], status: 'ACTIVE',
    availableGreenPoints: 0, greenPostCount: 0, suspensionReason: null,
  },
  {
    id: 'u4', name: 'Lê Văn A', avatarUrl: null,
    createdAt: '2026-02-01T00:00:00Z', email: 'lva@email.com',
    phoneNumber: '0923456789', roles: ['USER'], status: 'SUSPENDED',
    availableGreenPoints: 40, greenPostCount: 3, suspensionReason: 'Spam bài viết',
  },
  {
    id: 'u5', name: 'Phạm Bảo Châu', avatarUrl: null,
    createdAt: '2026-02-14T00:00:00Z', email: 'chau@mail.com',
    phoneNumber: '0934567890', roles: ['USER'], status: 'ACTIVE',
    availableGreenPoints: 320, greenPostCount: 21, suspensionReason: null,
  },
  {
    id: 'u6', name: 'EcoViet Club', avatarUrl: null,
    createdAt: '2026-03-03T00:00:00Z', email: 'ecoviet@ngo.vn',
    phoneNumber: null, roles: ['NGO'], status: 'ACTIVE',
    availableGreenPoints: 0, greenPostCount: 0, suspensionReason: null,
  },
  {
    id: 'u7', name: 'Hoàng Minh', avatarUrl: null,
    createdAt: '2026-03-20T00:00:00Z', email: 'hminh@gmail.com',
    phoneNumber: '0945678901', roles: ['USER'], status: 'FLAGGED',
    availableGreenPoints: 10, greenPostCount: 1, suspensionReason: null,
  },
  {
    id: 'u8', name: 'Thu Hà', avatarUrl: null,
    createdAt: '2026-04-01T00:00:00Z', email: 'hatu@work.vn',
    phoneNumber: '0956789012', roles: ['USER'], status: 'ACTIVE',
    availableGreenPoints: 75, greenPostCount: 5, suspensionReason: null,
  },
];