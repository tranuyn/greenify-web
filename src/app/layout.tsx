import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Khởi tạo font Inter (Hỗ trợ tiếng Việt đầy đủ)
const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Greenify — Hành động vì môi trường",
  description:
    "Nền tảng ghi nhận hành vi xanh, kết nối cộng đồng với các điểm thu gom và tổ chức môi trường.",
  icons: {
    icon: "https://ik.imagekit.io/ii5tr5cdi/Material/Image/logo.svg?updatedAt=1776654858453",
    apple:
      "https://ik.imagekit.io/ii5tr5cdi/Material/Image/logo.svg?updatedAt=1776654858453",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${inter.variable}`}>
      {/* Đổi class thành font-sans để Tailwind nhận font Inter làm mặc định */}
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
