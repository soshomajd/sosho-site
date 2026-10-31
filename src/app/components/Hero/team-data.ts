import type { Locale } from "@/app/i18n";

export const STUDIO_TEAM = [
  {
    id: "soheil",
    image: "/brand/soheil-character-3d.webp",
    name: { fa: "سهیل شکوهی مجد", en: "Soheil Shokouhi Majd" },
    role: { fa: "راهبر فنی و بنیان‌گذار", en: "Tech Lead & Founder" },
    bio: { fa: "معماری، تصمیم‌های فنی و راهبری پروژه.", en: "Architecture, technical direction and project leadership." },
    kind: { fa: "بنیان‌گذار استودیو", en: "Studio founder" },
    alt: { fa: "چهرهٔ کارتونی سه‌بعدی سهیل شکوهی مجد، بنیان‌گذار سوشو استودیو", en: "3D cartoon portrait of Soheil Shokouhi Majd, founder of Sosho Studio" },
  },
  {
    id: "claude",
    image: "/brand/claude-character-20261029.webp",
    name: { fa: "Claude", en: "Claude" },
    role: { fa: "توسعه‌دهندهٔ بک‌اند و DevOps", en: "Backend Developer & DevOps" },
    bio: { fa: "همکار هوش مصنوعی برای منطق سرور و زیرساخت.", en: "An AI collaborator for server logic and infrastructure." },
    kind: { fa: "همکار هوش مصنوعی", en: "AI collaborator" },
    alt: { fa: "کاراکتر مفهومی سه‌بعدی Claude با چهرهٔ مسی؛ همکار هوش مصنوعی بک‌اند و DevOps", en: "Original copper 3D Claude mascot, an AI collaborator for backend development and DevOps" },
  },
  {
    id: "codex",
    image: "/brand/codex-character-20261029.webp",
    name: { fa: "Codex", en: "Codex" },
    role: { fa: "توسعه‌دهندهٔ فرانت‌اند و طراح", en: "Frontend Developer & Designer" },
    bio: { fa: "همکار هوش مصنوعی برای طراحی و ساخت رابط کاربری.", en: "An AI collaborator for interface design and frontend development." },
    kind: { fa: "همکار هوش مصنوعی", en: "AI collaborator" },
    alt: { fa: "کاراکتر مفهومی سه‌بعدی Codex با چهرهٔ روشن؛ همکار هوش مصنوعی فرانت‌اند و طراحی", en: "Original ivory 3D Codex mascot, an AI collaborator for frontend development and design" },
  },
] as const;

export const TEAM_COPY = {
  fa: { label: "تیم سوشو استودیو", previous: "عضو قبلی", next: "عضو بعدی", choose: "نمایش", of: "از", slide: "اسلاید" },
  en: { label: "The Sosho Studio team", previous: "Previous team member", next: "Next team member", choose: "Show", of: "of", slide: "slide" },
} satisfies Record<Locale, Record<string, string>>;
