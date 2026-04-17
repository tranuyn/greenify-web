import {
  Users,
  Calendar,
  Leaf,
  TrendingUp,
  MapPin,
  Trophy,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

/* ─── mock data ─────────────────────────────────── */
const STAT_CARDS = [
  {
    label: "Tổng người dùng",
    value: "3,241",
    delta: "+12%",
    icon: Users,
    color: "bg-blue-50   text-blue-600   border-blue-500",
  },
  {
    label: "Hành động xanh",
    value: "12,408",
    delta: "+28%",
    icon: Leaf,
    color: "bg-primary-50 text-primary-600 border-primary-100",
  },
  {
    label: "Sự kiện tháng này",
    value: "48",
    delta: "+5",
    icon: Calendar,
    color: "bg-violet-50 text-violet-600 border-violet-100",
  },
  {
    label: "Điểm GP phát ra",
    value: "89.2K",
    delta: "+18%",
    icon: Trophy,
    color: "bg-amber-50  text-amber-600  border-amber-100",
  },
];

const RECENT_EVENTS = [
  {
    title: "Dọn rác bãi biển Cần Giờ",
    ngo: "Green Future VN",
    status: "PENDING_APPROVAL",
    date: "05/04/2026",
    participants: 32,
  },
  {
    title: "Workshop: Làm phân compost",
    ngo: "EcoViet",
    status: "PUBLISHED",
    date: "12/04/2026",
    participants: 18,
  },
  {
    title: "Trồng cây Công viên Gia Định",
    ngo: "Green Future VN",
    status: "PENDING_APPROVAL",
    date: "22/04/2026",
    participants: 67,
  },
  {
    title: "Thu gom pin cũ Q.3",
    ngo: "RecycleHub",
    status: "APPROVED",
    date: "01/05/2026",
    participants: 0,
  },
];

const RECENT_USERS = [
  {
    name: "Nguyễn Nhã Uyên",
    role: "USER",
    status: "ACTIVE",
    joined: "10/01/2026",
  },
  {
    name: "Trần Minh Thiện",
    role: "CTV",
    status: "ACTIVE",
    joined: "15/01/2026",
  },
  {
    name: "Green Future VN",
    role: "NGO",
    status: "ACTIVE",
    joined: "20/01/2026",
  },
  { name: "Lê Văn X", role: "USER", status: "SUSPENDED", joined: "01/02/2026" },
];

const EVENT_STATUS_CONFIG: Record<
  string,
  { label: string; icon: typeof Clock; cls: string }
> = {
  PENDING_APPROVAL: {
    label: "Chờ duyệt",
    icon: Clock,
    cls: "bg-amber-50 text-amber-600",
  },
  APPROVED: {
    label: "Đã duyệt",
    icon: CheckCircle,
    cls: "bg-primary-50 text-primary-700",
  },
  PUBLISHED: {
    label: "Đã đăng",
    icon: CheckCircle,
    cls: "bg-blue-50 text-blue-600",
  },
  REJECTED: {
    label: "Từ chối",
    icon: XCircle,
    cls: "bg-rose-50 text-rose-500",
  },
};

const USER_STATUS_CONFIG: Record<string, { cls: string; label: string }> = {
  ACTIVE: { cls: "bg-primary-100 text-primary-700", label: "Hoạt động" },
  SUSPENDED: { cls: "bg-rose-100 text-rose-600", label: "Tạm khóa" },
};

const ROLE_CONFIG: Record<string, { cls: string }> = {
  USER: { cls: "bg-gray-100 text-gray-600" },
  CTV: { cls: "bg-blue-100 text-blue-700" },
  NGO: { cls: "bg-violet-100 text-violet-700" },
  ADMIN: { cls: "bg-amber-100 text-amber-700" },
};

/* ─── weekly activity bar chart (pure CSS) ────────────────── */
const WEEKLY = [
  { day: "T2", posts: 48, events: 2 },
  { day: "T3", posts: 72, events: 1 },
  { day: "T4", posts: 55, events: 3 },
  { day: "T5", posts: 89, events: 2 },
  { day: "T6", posts: 103, events: 4 },
  { day: "T7", posts: 134, events: 5 },
  { day: "CN", posts: 91, events: 3 },
];
const maxPosts = Math.max(...WEEKLY.map((w) => w.posts));

/* ─── components ─────────────────────────────────── */
function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  color,
}: (typeof STAT_CARDS)[number]) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-6 shadow-sm`}>
      <div className="mb-4 flex items-start justify-between">
        <div className={`rounded-xl border p-2.5 ${color}`}>
          <Icon size={20} />
        </div>
        <span className="flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 font-mono text-xs text-primary-700">
          <TrendingUp size={10} />
          {delta}
        </span>
      </div>
      <div className="font-display text-3xl text-forest">{value}</div>
      <div className="mt-1 font-body text-sm text-gray-500">{label}</div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h2 className="font-bold text-3xl text-primary-heading">Tổng quan</h2>
        <p className="mt-1 font-body text-sm text-gray-500">
          Dữ liệu tháng 4/2026 — cập nhật realtime
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {STAT_CARDS.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Charts + tables row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly activity chart — takes 2/3 */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-body text-base font-semibold text-forest">
              Hoạt động tuần này
            </h3>
            <div className="flex items-center gap-4 font-body text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-primary-500" /> Bài
                đăng
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-violet-400" /> Sự
                kiện ×10
              </span>
            </div>
          </div>

          <div className="flex h-48 items-end gap-3">
            {WEEKLY.map((w) => (
              <div
                key={w.day}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <div className="relative flex w-full items-end gap-1">
                  {/* Posts bar */}
                  <div
                    className="flex-1 rounded-t-lg bg-primary-400 transition-all hover:bg-primary-500"
                    style={{ height: `${(w.posts / maxPosts) * 176}px` }}
                    title={`${w.posts} bài đăng`}
                  />
                  {/* Events bar (scaled ×10 for visibility) */}
                  <div
                    className="w-2 rounded-t-md bg-violet-300 transition-all hover:bg-violet-400"
                    style={{
                      height: `${((w.events * 10) / maxPosts) * 176}px`,
                    }}
                    title={`${w.events} sự kiện`}
                  />
                </div>
                <span className="font-mono text-[10px] text-gray-400">
                  {w.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats — takes 1/3 */}
        <div className="space-y-4">
          {[
            {
              label: "Bài đăng chờ duyệt",
              value: 23,
              icon: Clock,
              cls: "text-amber-500 bg-amber-50",
            },
            {
              label: "Sự kiện chờ duyệt",
              value: 5,
              icon: Calendar,
              cls: "text-violet-500 bg-violet-50",
            },
            {
              label: "Báo cáo bãi rác mới",
              value: 12,
              icon: AlertTriangle,
              cls: "text-rose-500 bg-rose-50",
            },
            {
              label: "Điểm thu gom active",
              value: 89,
              icon: MapPin,
              cls: "text-primary-600 bg-primary-50",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm"
            >
              <div className={`rounded-xl p-2.5 ${item.cls}`}>
                <item.icon size={18} />
              </div>
              <div className="flex-1">
                <div className="font-body text-xs text-gray-500">
                  {item.label}
                </div>
                <div className="font-display text-2xl text-forest">
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent tables row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent events needing approval */}
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-6 py-4">
            <h3 className="font-body text-base font-semibold text-forest">
              Sự kiện gần đây
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {RECENT_EVENTS.map((evt) => {
              const s = EVENT_STATUS_CONFIG[evt.status];
              return (
                <div
                  key={evt.title}
                  className="flex items-center gap-4 px-6 py-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-body text-sm font-medium text-forest">
                      {evt.title}
                    </p>
                    <p className="font-body text-xs text-gray-400">
                      {evt.ngo} · {evt.date}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 font-body text-[10px] font-semibold ${s.cls}`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent users */}
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-6 py-4">
            <h3 className="font-body text-base font-semibold text-forest">
              Người dùng gần đây
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {RECENT_USERS.map((user) => {
              const role = ROLE_CONFIG[user.role];
              const status = USER_STATUS_CONFIG[user.status];
              return (
                <div
                  key={user.name}
                  className="flex items-center gap-4 px-6 py-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 font-body text-sm font-bold text-primary-700">
                    {user.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-body text-sm font-medium text-forest">
                      {user.name}
                    </p>
                    <p className="font-body text-xs text-gray-400">
                      Tham gia {user.joined}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 font-body text-[10px] font-semibold ${role.cls}`}
                    >
                      {user.role}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 font-body text-[10px] font-semibold ${status.cls}`}
                    >
                      {status.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
