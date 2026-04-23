import type { Province, Ward } from '../../types/location.types';

export const MOCK_PROVINCES: Province[] = [
  { code: 1, codename: 'thanh-pho-ha-noi', divisionType: 'thành phố trung ương', name: 'Hà Nội', phoneCode: 24 },
  { code: 79, codename: 'thanh-pho-ho-chi-minh', divisionType: 'thành phố trung ương', name: 'TP. Hồ Chí Minh', phoneCode: 28 },
  { code: 48, codename: 'thanh-pho-da-nang', divisionType: 'thành phố trung ương', name: 'Đà Nẵng', phoneCode: 236 },
  { code: 31, codename: 'thanh-pho-hai-phong', divisionType: 'thành phố trung ương', name: 'Hải Phòng', phoneCode: 225 },
  { code: 92, codename: 'thanh-pho-can-tho', divisionType: 'thành phố trung ương', name: 'Cần Thơ', phoneCode: 292 },
  { code: 46, codename: 'tinh-thua-thien-hue', divisionType: 'tỉnh', name: 'Thừa Thiên Huế', phoneCode: 234 },
  { code: 56, codename: 'tinh-khanh-hoa', divisionType: 'tỉnh', name: 'Khánh Hòa', phoneCode: 258 },
  { code: 74, codename: 'tinh-binh-duong', divisionType: 'tỉnh', name: 'Bình Dương', phoneCode: 274 },
  { code: 75, codename: 'tinh-dong-nai', divisionType: 'tỉnh', name: 'Đồng Nai', phoneCode: 251 },
  { code: 77, codename: 'tinh-ba-ria-vung-tau', divisionType: 'tỉnh', name: 'Bà Rịa - Vũng Tàu', phoneCode: 254 },
];

export const MOCK_WARDS: Ward[] = [
  // TP. Hồ Chí Minh
  { code: 26734, codename: 'phuong-ben-nghe', divisionType: 'phường', name: 'Phường Bến Nghé', provinceCode: 79 },
  { code: 26737, codename: 'phuong-ben-thanh', divisionType: 'phường', name: 'Phường Bến Thành', provinceCode: 79 },
  { code: 26740, codename: 'phuong-cau-ong-lanh', divisionType: 'phường', name: 'Phường Cầu Ông Lãnh', provinceCode: 79 },
  { code: 26869, codename: 'phuong-1-binh-thanh', divisionType: 'phường', name: 'Phường 1 (Bình Thạnh)', provinceCode: 79 },
  { code: 26872, codename: 'phuong-2-binh-thanh', divisionType: 'phường', name: 'Phường 2 (Bình Thạnh)', provinceCode: 79 },
  // Hà Nội
  { code: 1, codename: 'phuong-hang-bac', divisionType: 'phường', name: 'Phường Hàng Bạc', provinceCode: 1 },
  { code: 4, codename: 'phuong-hang-bo', divisionType: 'phường', name: 'Phường Hàng Bồ', provinceCode: 1 },
  { code: 7, codename: 'phuong-hang-dao', divisionType: 'phường', name: 'Phường Hàng Đào', provinceCode: 1 },
];
