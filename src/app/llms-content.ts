import { getBlogPostHref, getBlogPosts, type BlogPost } from "@/app/blogs/posts";
import { CONTACT_INFO } from "@/app/contact-info";
import { PROJECTS } from "@/app/components/Projects/data";
import { CONCEPT_PROJECTS, isIndexableConcept } from "@/app/components/Projects/concepts";
import { SERVICES } from "@/app/components/Services/data";
import { SERVICE_FAQ } from "@/app/components/Services/faq";
import { SERVICE_GUIDE } from "@/app/components/Services/guide";
import { servicesForPost } from "@/app/blogs/related";
import { TOOLS } from "@/app/components/Tools/data";
import { baseUrl } from "@/app/seo";

// Plain-markdown site guides for AI answer engines (https://llmstxt.org).
// /llms.txt is the short index; /llms-full.txt carries every article in full.

const header = [
  "# Sosho Studio (سوشو استودیو)",
  "",
  "> Sosho Studio is a bilingual (Persian / English) digital studio that designs and builds custom websites and web apps, WordPress and WooCommerce stores, SEO and Google growth (including GEO/AEO for AI answers), AI automation, Web3 and smart contracts, and brand/UI/UX.",
  "> سوشو استودیو طراحی و توسعه سایت اختصاصی و وردپرس، سئو و رشد در گوگل، اتوماسیون هوش مصنوعی، Web3 و قرارداد هوشمند و طراحی برند و تجربه کاربری را به دو زبان فارسی و انگلیسی انجام می‌دهد.",
  "",
  "Prices are not published: every project is quoted after a short discovery conversation. Persian pages live under /fa and English pages under /en; both versions have the same content.",
  "",
];

function contactSection() {
  return [
    "## Contact / تماس",
    "",
    `- Contact form: ${baseUrl}/fa#contact (English: ${baseUrl}/en#contact)`,
    `- Phone / WhatsApp: ${CONTACT_INFO.phoneDisplay}`,
    `- Email: ${CONTACT_INFO.email}`,
    `- LinkedIn: ${CONTACT_INFO.linkedinUrl}`,
    `- Telegram: ${CONTACT_INFO.telegramUrl}`,
    `- Instagram: ${CONTACT_INFO.instagramUrl}`,
    "",
  ];
}

function servicesSection() {
  const lines = ["## Services / خدمات", ""];
  for (const service of SERVICES) {
    lines.push(
      `- [${service.seo.title.en}](${baseUrl}/en/services/${service.slug}): ${service.seo.description.en}`,
      `- [${service.seo.title.fa}](${baseUrl}/fa/services/${service.slug}): ${service.seo.description.fa}`
    );
  }
  lines.push("");
  return lines;
}

function toolsSection() {
  const lines = ["## Free tools / ابزارهای رایگان", ""];
  for (const tool of TOOLS) {
    lines.push(
      `- [${tool.seo.title.en}](${baseUrl}/en/tools/${tool.slug}): ${tool.seo.description.en}`,
      `- [${tool.seo.title.fa}](${baseUrl}/fa/tools/${tool.slug}): ${tool.seo.description.fa}`
    );
  }
  lines.push("");
  return lines;
}

function projectsSection() {
  const lines = [
    "## Selected work / نمونه‌کارها", "",
    `- [More original design concepts](${baseUrl}/en/projectcs): Original design studies with desktop, tablet and mobile hero views; these are not delivered client projects.`,
    `- [طرح‌های مفهومی بیشتر](${baseUrl}/fa/projectcs): مجموعهٔ طرح‌ها با نمای هیرو در دسکتاپ، تبلت و موبایل؛ این‌ها پروژهٔ تحویل‌شده به مشتری نیستند.`,
  ];
  for (const project of PROJECTS) {
    lines.push(
      `- [${project.seo.title.en}](${baseUrl}/en/projects/${project.slug}): ${project.seo.description.en}`,
      `- [${project.seo.title.fa}](${baseUrl}/fa/projects/${project.slug}): ${project.seo.description.fa}`
    );
  }
  lines.push("", "### Original design studies / مطالعه‌های طراحی مفهومی", "", "The following are original visual studies, not delivered client projects or live products.", "");
  for (const concept of CONCEPT_PROJECTS.filter(isIndexableConcept)) {
    for (const locale of ["en", "fa"] as const) {
      lines.push(`- [${concept.title[locale]}](${baseUrl}/${locale}/projects/${concept.slug}): ${concept.summary[locale]}`);
    }
  }
  lines.push("");
  return lines;
}

function articlesIndex(posts: BlogPost[]) {
  const lines = ["## Articles / مقاله‌ها", ""];
  for (const post of posts) {
    lines.push(
      `- [${post.title.en}](${baseUrl}${getBlogPostHref("en", post.slug)}): ${post.excerpt.en}`,
      `- [${post.title.fa}](${baseUrl}${getBlogPostHref("fa", post.slug)}): ${post.excerpt.fa}`
    );
  }
  lines.push("");
  return lines;
}

export function buildLlmsTxt() {
  const posts = getBlogPosts();
  return [
    ...header,
    ...servicesSection(),
    ...toolsSection(),
    ...projectsSection(),
    ...articlesIndex(posts),
    ...contactSection(),
    "## Optional",
    "",
    `- [Full text of every article and service FAQ](${baseUrl}/llms-full.txt)`,
    `- [Sitemap](${baseUrl}/sitemap.xml)`,
    "",
  ].join("\n");
}

function articleMarkdown(post: BlogPost, locale: "fa" | "en") {
  const lines = [
    `### ${post.title[locale]}`,
    "",
    `URL: ${baseUrl}${getBlogPostHref(locale, post.slug)}`,
    `Published: ${post.publishedAt}${post.updatedAt ? ` · Updated: ${post.updatedAt}` : ""}`,
    "",
  ];
  if (post.directAnswer) lines.push(post.directAnswer[locale], "");
  for (const [index, section] of post.sections.entries()) {
    lines.push(`#### ${section.heading[locale]}`, "", ...section.paragraphs[locale].flatMap((p) => [p, ""]));
    if (section.bullets) lines.push(...section.bullets[locale].map((b) => `- ${b}`), "");
    if (index === 0) {
      for (const slug of servicesForPost(post).slice(0, 2)) {
        const service = SERVICES.find((entry) => entry.slug === slug)!;
        lines.push(`- [${service.title[locale]}](${baseUrl}/${locale}/services/${slug})`, "");
      }
    }
  }
  if (post.faq && post.faq.length > 0) {
    lines.push(locale === "fa" ? "#### پرسش‌های متداول" : "#### FAQ", "");
    for (const item of post.faq) lines.push(`**${item.question[locale]}**`, item.answer[locale], "");
  }
  if (post.sources?.length) {
    lines.push(locale === "fa" ? "#### منابع" : "#### Sources", "");
    for (const source of post.sources) lines.push(`- [${source.title[locale]}](${source.url})`);
    lines.push("");
  }
  return lines;
}

export function buildLlmsFullTxt() {
  const posts = getBlogPosts();
  const lines = [...header, ...contactSection(), "## Services / خدمات", ""];
  for (const service of SERVICES) {
    for (const locale of ["en", "fa"] as const) {
      lines.push(
        `### ${service.seo.title[locale]}`,
        "",
        `URL: ${baseUrl}/${locale}/services/${service.slug}`,
        "",
        service.detail.intro[locale],
        "",
        ...service.detail.whatYouGet[locale].map((item) => `- ${item}`),
        "",
        ...SERVICE_GUIDE[service.slug].approach[locale],
        "",
        ...SERVICE_FAQ[service.slug].flatMap((item) => [`**${item.question[locale]}**`, item.answer[locale], ""])
      );
    }
  }
  lines.push("## Real case studies / نمونه‌کارهای واقعی", "");
  for (const project of PROJECTS) for (const locale of ["en", "fa"] as const) {
    lines.push(`### ${project.seo.title[locale]}`, "", `URL: ${baseUrl}/${locale}/projects/${project.slug}`, `Updated: ${project.updatedAt}`, "", project.caseStudy.challenge[locale], "");
    for (const decision of project.caseStudy.decisions) lines.push(`#### ${decision.title[locale]}`, "", decision.text[locale], "");
    lines.push(...project.caseStudy.journey[locale].map((step) => `- ${step}`), "", project.caseStudy.takeaway[locale], "");
  }
  lines.push("## Original design studies / مطالعه‌های طراحی مفهومی", "", "These are design concepts, not delivered client projects. / این‌ها طرح مفهومی‌اند، نه پروژهٔ تحویل‌شده به مشتری.", "");
  for (const concept of CONCEPT_PROJECTS.filter(isIndexableConcept)) for (const locale of ["en", "fa"] as const) {
    lines.push(`### ${concept.title[locale]}`, "", `URL: ${baseUrl}/${locale}/projects/${concept.slug}`, `Updated: ${concept.updatedAt}`, "", concept.summary[locale], "");
    for (const section of concept.study ?? []) lines.push(`#### ${section.heading[locale]}`, "", ...section.paragraphs[locale].flatMap(p => [p, ""]));
  }
  lines.push("## Articles (English)", "");
  for (const post of posts) lines.push(...articleMarkdown(post, "en"));
  lines.push("## مقاله‌ها (فارسی)", "");
  for (const post of posts) lines.push(...articleMarkdown(post, "fa"));
  return lines.join("\n");
}
