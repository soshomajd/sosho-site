"use client";

import type { Locale } from "@/app/i18n";
import dynamic from "next/dynamic";

const Hero3D = dynamic(() => import("./Hero3D"), {
    ssr: false,
    loading: () => <div className="absolute inset-0" />,
});

export default function Hero3DClient({
    sectionId,
    locale,
}: {
    sectionId: string;
    locale: Locale;
}) {
    return <Hero3D sectionId={sectionId} isRtl={locale === "fa"} />;
}
