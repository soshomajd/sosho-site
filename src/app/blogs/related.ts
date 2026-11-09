import type { ServiceSlug } from "@/app/components/Services/data";

import { getBlogPosts, type BlogPost } from "./posts";

// Which service page an article should send readers to, by the first matching tag.
const TAG_TO_SERVICE: Record<string, ServiceSlug> = {
  Web3: "web3-blockchain",
  Blockchain: "web3-blockchain",
  "Smart Contract": "web3-blockchain",
  Solidity: "web3-blockchain",
  Hardhat: "web3-blockchain",
  "ethers.js": "web3-blockchain",
  DEX: "web3-blockchain",
  CEX: "web3-blockchain",
  SEO: "seo-google-growth",
  Google: "seo-google-growth",
  GEO: "seo-google-growth",
  AEO: "seo-google-growth",
  WordPress: "wordpress-woocommerce",
  AI: "ai-automation",
  Automation: "ai-automation",
  "UI/UX": "ui-ux-brand-design",
  Tailwind: "ui-ux-brand-design",
  ERP: "website-design-development",
  CRM: "website-design-development",
  Integration: "website-design-development",
  "Next.js": "web-application-development",
  Frontend: "web-application-development",
  Backend: "website-design-development",
  React: "web-application-development",
  "React Native": "mobile-app-development",
  Mobile: "mobile-app-development",
  "Node.js": "web-application-development",
  MongoDB: "web-application-development",
  Security: "website-design-development",
  Website: "website-design-development",
  Strategy: "website-design-development",
};

/** Curated buyer intent; one article may support more than one service. */
export const POST_SERVICE_FOCUS: Record<string, ServiceSlug[]> = {
  "corporate-website-pages-features-guide": [
    "corporate-website-design"
  ],
  "ecommerce-website-launch-guide": [
    "ecommerce-website-design"
  ],
  "website-content-preparation-checklist": [
    "corporate-website-design",
    "ecommerce-website-design"
  ],
  "website-redesign-seo-url-checklist": [
    "corporate-website-design",
    "ecommerce-website-design",
    "care-performance"
  ],
  "choose-website-design-team": [
    "corporate-website-design",
    "ecommerce-website-design"
  ],
  "website-or-mobile-app-for-business": [
    "corporate-website-design",
    "ecommerce-website-design",
    "mobile-app-development"
  ],
  "nextjs-ecommerce-service-website-seo": [
    "ecommerce-website-design",
    "web-application-development"
  ],
  "website-cost-page-count-complexity": [
    "corporate-website-design",
    "ecommerce-website-design"
  ],
  "reduce-website-build-maintenance-costs": [
    "corporate-website-design",
    "ecommerce-website-design"
  ],
  "wordpress-vs-nextjs-which-website": [
    "corporate-website-design",
    "ecommerce-website-design",
    "wordpress-woocommerce"
  ],
  "ecommerce-product-page-seo": [
    "ecommerce-website-design",
    "seo-google-growth"
  ],
  "service-page-seo-conversion": [
    "corporate-website-design",
    "seo-google-growth"
  ]
};

export function serviceForPost(post: BlogPost): ServiceSlug {
  const focus = POST_SERVICE_FOCUS[post.slug];
  if (focus?.length) return focus[0];
  for (const tag of post.tags) {
    const service = TAG_TO_SERVICE[tag];
    if (service) return service;
  }
  return "website-design-development";
}

export function servicesForPost(post: BlogPost): ServiceSlug[] {
  return POST_SERVICE_FOCUS[post.slug] ?? [serviceForPost(post)];
}

/** Posts sharing the most tags with `post`, newest first on ties. */
export function relatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  const tags = new Set(post.tags);
  return getBlogPosts()
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => ({
      candidate,
      score:
        candidate.tags.filter((tag) => tags.has(tag)).length * 2 +
        (serviceForPost(candidate) === serviceForPost(post) ? 1 : 0),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

/** Newest posts that point readers to the given service. */
export function postsForService(service: ServiceSlug, limit = 3): BlogPost[] {
  return getBlogPosts()
    .filter((post) => servicesForPost(post).includes(service))
    .slice(0, limit);
}
