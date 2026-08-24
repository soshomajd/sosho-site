"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { FiMenu, FiX } from "react-icons/fi";

type NavItem = { label: string; href: string };
type SocialLink = { label: string; href: string; icon: ReactNode };

export default function MobileMenu({
    locale,
    navItems,
    socialLinks,
    ctaHref,
    ctaLabel,
    openLabel,
    closeLabel,
}: {
    locale: string;
    navItems: readonly NavItem[];
    socialLinks: readonly SocialLink[];
    ctaHref: string;
    ctaLabel: string;
    openLabel: string;
    closeLabel: string;
}) {
    const [open, setOpen] = useState(false);
    const [panelTop, setPanelTop] = useState(72);
    const panelId = useId();
    const firstLinkRef = useRef<HTMLAnchorElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!open) return;

        firstLinkRef.current?.focus();

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", onKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [open]);

    const handleToggle = () => {
        setOpen((value) => {
            const next = !value;
            if (next) {
                const header = buttonRef.current?.closest("header");
                if (header) setPanelTop(header.getBoundingClientRect().bottom + 8);
            }
            return next;
        });
    };

    return (
        <div className="lg:hidden">
            <button
                ref={buttonRef}
                type="button"
                onClick={handleToggle}
                aria-expanded={open}
                aria-controls={panelId}
                aria-label={open ? closeLabel : openLabel}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
                {open ? <FiX className="h-5 w-5" aria-hidden="true" /> : <FiMenu className="h-5 w-5" aria-hidden="true" />}
            </button>

            {open
                ? createPortal(
                        <>
                            <div
                                aria-hidden="true"
                                onClick={() => setOpen(false)}
                                className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm"
                            />
                            <div
                                id={panelId}
                                role="dialog"
                                aria-modal="true"
                                aria-label={locale === "fa" ? "پیمایش موبایل" : "Mobile navigation"}
                                style={{ top: panelTop }}
                                className="fixed inset-x-3 z-50 rounded-3xl border border-foreground/10 bg-surface/95 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl"
                            >
                                <nav className="flex flex-col gap-1">
                                    {navItems.map((item, index) => (
                                        <a
                                            key={item.href}
                                            href={item.href}
                                            ref={index === 0 ? firstLinkRef : undefined}
                                            onClick={() => setOpen(false)}
                                            className="rounded-xl px-3 py-3 text-base font-semibold text-foreground/85 transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                                        >
                                            {item.label}
                                        </a>
                                    ))}
                                </nav>

                                <a
                                    href={ctaHref}
                                    onClick={() => setOpen(false)}
                                    className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-foreground text-sm font-bold text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none"
                                >
                                    {ctaLabel}
                                </a>

                                <div className="mt-5 flex items-center justify-center gap-2 border-t border-foreground/10 pt-4">
                                    {socialLinks.map(({ href, label, icon }) => (
                                        <a
                                            key={href}
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={label}
                                            title={label}
                                            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-foreground/5 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                                        >
                                            {icon}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </>,
                        document.body,
                    )
                : null}
        </div>
    );
}
