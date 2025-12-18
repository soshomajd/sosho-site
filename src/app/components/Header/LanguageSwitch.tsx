"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGlobe } from "react-icons/fi";

const LOCALES = ["fa", "en"] as const;

type Locale = (typeof LOCALES)[number];

function getCurrentLocale(pathname: string): Locale | null {
    const seg = pathname.split("/").filter(Boolean)[0];
    return seg === "fa" || seg === "en" ? seg : null;
}

export default function LanguageSwitch() {
    const pathname = usePathname() ?? "/";
    const current = getCurrentLocale(pathname) ?? "fa";
    const next = current === "fa" ? "en" : "fa";

    const parts = pathname.split("/").filter(Boolean);
    if (parts.length > 0 && (parts[0] === "fa" || parts[0] === "en")) {
        parts[0] = next;
    } else {
        parts.unshift(next);
    }

    const href = "/" + parts.join("/");

    return (
        <Link
            href={href}
            aria-label={next === "fa" ? "Switch to Persian" : "Switch to English"}
            title={next === "fa" ? "فارسی" : "English"}
            className="text-muted transition-all duration-200 motion-reduce:transition-none hover:text-accent hover:-translate-y-0.5 motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
            <FiGlobe className="h-5 w-5" aria-hidden="true" />
        </Link>
    );
}
