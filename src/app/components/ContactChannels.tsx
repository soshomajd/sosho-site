import { FiArrowUpRight, FiPhone } from "react-icons/fi";
import { SiGmail, SiInstagram, SiLinkedin, SiTelegram, SiWhatsapp } from "react-icons/si";

import { CONTACT_INFO } from "@/app/contact-info";
import type { Locale } from "@/app/i18n";

const CHANNELS = [
  {
    href: CONTACT_INFO.phoneHref,
    external: false,
    Icon: FiPhone,
    label: { fa: "تماس تلفنی", en: "Phone" },
    value: CONTACT_INFO.phoneDisplay,
  },
  {
    href: CONTACT_INFO.whatsappUrl,
    external: true,
    Icon: SiWhatsapp,
    label: { fa: "واتس‌اپ", en: "WhatsApp" },
    value: CONTACT_INFO.phoneDisplay,
  },
  {
    href: CONTACT_INFO.telegramUrl,
    external: true,
    Icon: SiTelegram,
    label: { fa: "تلگرام", en: "Telegram" },
    value: CONTACT_INFO.telegramHandle,
  },
  {
    href: CONTACT_INFO.linkedinUrl,
    external: true,
    Icon: SiLinkedin,
    label: { fa: "لینکدین", en: "LinkedIn" },
    value: "Soheil Shokouhi Majd",
  },
  {
    href: `mailto:${CONTACT_INFO.email}`,
    external: false,
    Icon: SiGmail,
    label: { fa: "ایمیل", en: "Email" },
    value: CONTACT_INFO.email,
  },
  {
    href: CONTACT_INFO.instagramUrl,
    external: true,
    Icon: SiInstagram,
    label: { fa: "اینستاگرام", en: "Instagram" },
    value: "@sosho_studio",
  },
] as const;

/** The direct contact channels as a list of large links; shared by the home contact section and the contact page. */
export default function ContactChannels({ locale }: { locale: Locale }) {
  const isFa = locale === "fa";
  return (
    <>
      {CHANNELS.map(({ href, external, Icon, label, value }) => (
        <a
          key={href}
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="group flex items-center gap-4 rounded-2xl border border-foreground/10 bg-background/30 px-5 py-4 transition-colors hover:border-accent/40 hover:bg-background/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
        >
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-foreground/5 text-accent">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs text-muted">{isFa ? label.fa : label.en}</span>
            <span dir="ltr" className={`block truncate text-sm font-bold text-foreground ${isFa ? "text-right" : "text-left"}`}>
              {value}
            </span>
          </span>
          {external ? (
            <FiArrowUpRight
              className="h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-accent rtl:-scale-x-100"
              aria-hidden="true"
            />
          ) : null}
        </a>
      ))}
    </>
  );
}
