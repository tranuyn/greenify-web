import type { Metadata } from "next";
import AppealsAdminPageClient from "@/components/admin/appeals/AppealsAdminPageClient";

export const metadata: Metadata = {
  title: "Admin Appeals | Greenify",
  description: "Review and manage post appeal requests in the Greenify admin portal.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AppealsPage() {
  return <AppealsAdminPageClient />;
}