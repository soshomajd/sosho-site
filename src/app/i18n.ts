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
    siteName: "سهیل شکوهی مجد",
    tagline: "فریلنسر",
    nav: {
      projects: "پروژه‌ها",
      services: "خدمات",
      about: "درباره من",
      blog: "بلاگ",
    },
  },
  en: {
    siteName: "Soheil Shokouhi Majd",
    tagline: "Freelancer",
    nav: {
      projects: "Projects",
      services: "Services",
      about: "About",
      blog: "Blog",
    },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
