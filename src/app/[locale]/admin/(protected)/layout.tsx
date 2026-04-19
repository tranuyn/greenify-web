"use client";

import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useState } from "react";
import {
  Leaf,
  LayoutDashboard,
  Users,
  Calendar,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
  Trophy,
  Gift,
} from "lucide-react";

const NAV = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Tổng quan" },
  { href: "/admin/users", icon: Users, label: "Người dùng" },
  { href: "/admin/events", icon: Calendar, label: "Sự kiện NGO" },
  { href: "/admin/vouchers", icon: Gift, label: "Voucher" },
  { href: "/admin/leaderboard", icon: Trophy, label: "Leaderboard" },
  { href: '/admin/action-types', icon: Leaf, label: 'Hành động xanh' },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "admin_token=; max-age=0; path=/";
    router.push("/admin/login");
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-primary-900/30 bg-forest transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-primary-900/30 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-500">
            <Leaf size={14} className="text-forest" />
          </div>
          <span className="font-bold text-lg text-primary">Greenify</span>
          <span className="ml-auto rounded-md bg-primary-900/50 px-2 py-0.5 font-mono text-[10px] text-primary-400">
            ADMIN
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 py-6">
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`sidebar-item flex items-center gap-3 rounded-xl px-4 py-3 font-body text-sm font-medium transition-all ${
                  active
                    ? "bg-primary-hover/20 text-primary-content"
                    : "text-primary-content/60 hover:bg-primary-element/30 hover:text-primary-content"
                }`}
              >
                <Icon size={18} />
                {label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-primary-900/30 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-body text-sm font-medium text-rose-400/70 transition-all hover:bg-rose-900/20 hover:text-rose-400"
          >
            <LogOut size={18} />
            Đăng xuất
          </button>
        </div>
      </aside>
    </>
  );
}

function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const currentPage = NAV.find((n) => pathname.startsWith(n.href));

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-card px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-body text-lg font-semibold text-forest">
          {currentPage?.label ?? "Admin"}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100">
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 font-body text-sm font-bold text-white">
          A
        </div>
      </div>
    </header>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-body">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content — offset by sidebar width on lg */}
      <div className="lg:pl-64">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
