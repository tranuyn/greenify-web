import { redirect } from 'next/navigation';

export default function RootPage() {
  // Chuyển hướng người dùng vào thẳng trang tiếng Việt
  redirect('/vi');
}