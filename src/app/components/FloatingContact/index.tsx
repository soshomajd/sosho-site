import { SiWhatsapp } from "react-icons/si";

import { CONTACT_INFO } from "@/app/contact-info";
import type { Locale } from "@/app/i18n";

/**
 * One-tap WhatsApp button for phones. The header hides its contact icons on small screens, so
 * this keeps a direct line to the owner in reach. It sits on the opposite corner from the chat
 * launcher (which uses `end`), and desktop already has the header icons.
 */
export default function FloatingContact({ locale }: { locale: Locale }) {
  const label = locale === "fa" ? "گفتگو در واتس‌اپ" : "Chat on WhatsApp";
  return (
    <a
      href={CONTACT_INFO.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="fixed bottom-4 start-4 z-60 grid h-12 w-12 place-items-center rounded-full bg-sage text-background shadow-lg shadow-black/40 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none sm:hidden"
    >
      <SiWhatsapp className="h-6 w-6" aria-hidden="true" />
    </a>
  );
}
