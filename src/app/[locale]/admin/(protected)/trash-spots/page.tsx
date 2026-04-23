import type { Metadata } from "next";
import TrashSpotsAdminPageClient from "@/components/admin/trash-spots/TrashSpotsAdminPageClient";

export const metadata: Metadata = {
  title: "Admin Trash Spots | Greenify",
  description:
    "Manage trash spots, resolve requests, and community reports in the Greenify admin portal.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TrashSpotsAdminPage() {
  return <TrashSpotsAdminPageClient />;
}
