"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  TABS,
  type TrashSpotsTab,
} from "@/components/admin/trash-spots/constants";
import { ResolveRequestsTab } from "@/components/admin/trash-spots/tabs/ResolveRequestsTab";
import { TrashSpotsTab as TrashSpotsTabContent } from "@/components/admin/trash-spots/tabs/TrashSpotsTab";
import { ReportsTab } from "@/components/admin/trash-spots/tabs/ReportsTab";

export default function TrashSpotsAdminPageClient() {
  const t = useTranslations("admin.trashSpots");
  const [activeTab, setActiveTab] = useState<TrashSpotsTab>("requests");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary-heading">
          {t("title")}
        </h2>
        <p className="mt-1 text-sm font-medium text-gray-500">
          {t("subtitle")}
        </p>
      </div>

      <div className="w-fit rounded-2xl bg-neutral-100/80 dark:bg-neutral-800/80 p-1">
        <div className="flex gap-1">
          {TABS.map(({ key, labelKey, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                activeTab === key
                  ? "bg-background text-primary-700 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              }`}
            >
              <Icon size={15} />
              {t(labelKey)}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "requests" && <ResolveRequestsTab />}
      {activeTab === "spots" && <TrashSpotsTabContent />}
      {activeTab === "reports" && <ReportsTab />}
    </div>
  );
}
