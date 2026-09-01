import { Suspense } from "react";

import CampaignDetailClient from "./CampaignDetailClient";

export default function AdminCampaignDetailPage() {
  return (
    <Suspense fallback={<div className="rounded-2xl border border-white/10 bg-surface p-6 text-sm text-muted" role="status">در حال آماده‌سازی جزئیات…</div>}>
      <CampaignDetailClient />
    </Suspense>
  );
}
