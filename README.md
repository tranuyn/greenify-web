# 🌿 Greenify Web Platform

Chào mừng bạn đến với Repository của **Greenify Web Platform**. Đây là hệ thống nền tảng web chính thức của dự án Greenify, đóng vai trò là cầu nối giữa người dùng cuối (End-users) và ban quản trị hệ thống (Administrators).

🌐 **Live Demo (Đã Deploy):** [https://greenify-web.vercel.app/](https://greenify-web.vercel.app/)  
🎥 **Video Demo Dự Án:** [Xem tại đây](https://drive.google.com/drive/folders/1cTiDzycfVNx0jm06iWbolZreTAyeIHsA?usp=drive_link)

---

## Chức năng cốt lõi (Core Features)

Dự án Web được chia làm 2 phân hệ chính biệt lập, tối ưu hóa trải nghiệm cho từng đối tượng người dùng:

### 1. 📱 Landing Page (Trang giới thiệu & Tải App)
Trang đích được thiết kế thân thiện, hiện đại giúp người dùng dễ dàng tiếp cận dự án:
- **Giới thiệu dự án:** Trình bày sứ mệnh, tầm nhìn và các tính năng nổi bật của ứng dụng di động Greenify.
- **Tải ứng dụng dễ dàng:** Cung cấp các nút điều hướng (Call-to-Action) trực tiếp đến App Store và Google Play Store.
- **Responsive Design:** Tối ưu hóa hiển thị mượt mà trên mọi thiết bị (Mobile, Tablet, Desktop).

### 2. 🛡️ Admin Dashboard (Hệ thống Quản trị)
Phân hệ dành riêng cho Ban quản trị để điều hành và kiểm soát dữ liệu hệ thống:
- **Xác thực bảo mật:** Đăng nhập an toàn dành riêng cho Admin.
- **Quản lý Vị trí rác (Trash Spots):** Xét duyệt, cập nhật trạng thái và phân bổ tổ chức NGO xử lý các điểm rác do cộng đồng báo cáo (Tích hợp bản đồ trực quan).
- **Quản lý Điểm thu gom (Recycling Stations):** Thêm mới, chỉnh sửa tọa độ (Interactive Map Picker) và thời gian hoạt động của các trạm thu gom rác tái chế.
- **Gamification & Leaderboard:** Cấu hình phần thưởng (Vouchers), xét duyệt bảng xếp hạng thi đua hàng tuần cho người dùng.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

- **Framework:** Next.js (App Router) / React
- **Ngôn ngữ:** TypeScript
- **Styling:** Tailwind CSS
- **Quản lý State & API:** TanStack React Query / Axios
- **Form & Validation:** React Hook Form / Zod
- **Bản đồ (Maps):** Leaflet / React-Leaflet
- **Đa ngôn ngữ (i18n):** `next-intl`
- **Deployment:** Vercel

---

## 🚀 Hướng dẫn cài đặt (Getting Started)

Nếu bạn muốn chạy dự án này trên máy tính cá nhân (Local Environment):

**1. Clone repository:**
```bash
git clone [https://github.com/your-username/greenify-web.git](https://github.com/your-username/greenify-web.git)
cd greenify-web
