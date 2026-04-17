
import {
  Leaf, MapPin, Trophy, Calendar, Users, ArrowRight,
  Smartphone, Star, ChevronRight, Shield, Recycle,
  TreePine, Download as DownloadIcon, Check,
} from 'lucide-react';

/* ── Data ─────────────────────────────────────────── */
export const STATS = [
  { value: "12.400+", label: "Hành động xanh" },
  { value: "3.200+", label: "Thành viên" },
  { value: "89", label: "Điểm thu gom" },
  { value: "240+", label: "Sự kiện" },
];

export const FEATURES = [
  {
    icon: Recycle,
    title: "Ghi nhận hành động xanh",
    desc: "Chụp ảnh, đăng bài và được cộng đồng xác thực. Mỗi hành động nhỏ đều để lại dấu ấn.",
  },
  {
    icon: Trophy,
    title: "Tích điểm & Đổi thưởng",
    desc: "Kiếm GP từ hành động xanh, đổi voucher từ các thương hiệu bền vững như Xanh SM, Cocoon.",
  },
  {
    icon: MapPin,
    title: "Bản đồ thu gom",
    desc: "Tìm điểm thu gom rác tái chế gần nhất theo loại rác — giấy, nhựa, pin, điện tử.",
  },
  {
    icon: Calendar,
    title: "Sự kiện cộng đồng",
    desc: "Tham gia dọn rác, trồng cây, workshop môi trường và nhận điểm khi check-in QR.",
  },
  {
    icon: TreePine,
    title: "Vườn cây ảo",
    desc: "Duy trì chuỗi ngày xanh để nuôi cây ảo. Cây trưởng thành mang lại phần thưởng thật.",
  },
  {
    icon: Users,
    title: "Kết nối NGO",
    desc: "Các tổ chức môi trường tổ chức và quản lý hoạt động cộng đồng ngay trên nền tảng.",
  },
];

export const TESTIMONIALS = [
  {
    name: "Nguyễn Minh Anh",
    role: "Sinh viên, TP.HCM",
    avatar: "MA",
    stars: 5,
    text: "Mình đã duy trì streak 30 ngày xanh và nuôi xong cây đầu tiên. Cảm giác rất có ý nghĩa!",
  },
  {
    name: "Green Future VN",
    role: "Tổ chức NGO",
    avatar: "GF",
    stars: 5,
    text: "Greenify giúp chúng tôi quản lý đăng ký và điểm danh sự kiện cực kỳ dễ dàng.",
  },
  {
    name: "Trần Bảo Châu",
    role: "Nhân viên văn phòng",
    avatar: "BC",
    stars: 5,
    text: "Tìm điểm thu gom pin gần nhà trong 30 giây. Không còn sợ vứt sai chỗ nữa.",
  },
];
