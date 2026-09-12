import type { Locale } from "@/app/i18n";
import { HERO_COPY } from "../Hero";

/**
 * The hero headline as it appears inside the 3D tour.
 *
 * `Hero` itself cannot be reused here: it owns a full-bleed sticky layout and
 * mounts its own WebGL canvas, and a canvas inside an `Html` panel inside
 * another canvas is not something R3F can render. Only the copy is shared, so
 * the wording never drifts between the tour and the plain page.
 */
export default function TourHero({ locale }: { locale: Locale }) {
    const copy = HERO_COPY[locale];

    return (
        <div>
            <p className="mb-5 flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.18em] text-accent sm:text-xs sm:tracking-[0.22em]">
                <span
                    aria-hidden="true"
                    className="h-px w-8 shrink-0 bg-gradient-to-r from-accent to-primary rtl:bg-gradient-to-l"
                />
                <span dir="ltr">{copy.eyebrow}</span>
            </p>

            <h1 className="max-w-[13ch] text-[clamp(2.2rem,5vw,4.4rem)] font-black leading-[0.98] tracking-[-0.05em] text-foreground">
                {copy.title}
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-muted">{copy.description}</p>

            <ul className="mt-6 flex max-w-2xl flex-wrap gap-2">
                {copy.services.map((service, index) => (
                    <li
                        key={service}
                        className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-surface/55 px-3 py-1.5 text-xs font-medium text-foreground/78 backdrop-blur-sm"
                    >
                        <span
                            aria-hidden="true"
                            className={`h-1.5 w-1.5 rounded-full ${
                                index % 2 === 0 ? "bg-accent" : "bg-primary"
                            }`}
                        />
                        <span dir={service === "Web3" ? "ltr" : undefined}>{service}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
