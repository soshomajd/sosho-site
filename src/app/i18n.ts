export const locales = ["fa", "en"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

type Dictionary = {
  siteName: string;
  tagline: string;
  nav: {
    projects: string;
    services: string;
    about: string;
    blog: string;
  };
};

const dictionaries: Record<Locale, Dictionary> = {
  fa: {
    siteName: "سوشو استودیو",
    tagline: "استودیوی کامل طراحی و توسعه دیجیتال",
    nav: {
      services: "خدمات",
      projects: "نمونه‌کارها",
      about: "درباره استودیو",
      blog: "مجله",
    },
  },
  en: {
    siteName: "Sosho Studio",
    tagline: "Full-service digital design & development studio",
    nav: {
      services: "Services",
      projects: "Work",
      about: "About",
      blog: "Insights",
    },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
