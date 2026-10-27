import { Suspense } from "react";

import ConsultantDetailClient from "./ConsultantDetailClient";

export default function AdminConsultantDetailPage() {
  return (
    <Suspense fallback={<div className="rounded-2xl border border-white/10 bg-surface p-6 text-sm text-muted" role="status">در حال آماده‌سازی جزئیات…</div>}>
      <ConsultantDetailClient />
    </Suspense>
  );
}
