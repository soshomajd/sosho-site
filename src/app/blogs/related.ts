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
  "Next.js": "website-design-development",
  Frontend: "website-design-development",
  Backend: "website-design-development",
  "Node.js": "website-design-development",
  MongoDB: "website-design-development",
  Security: "website-design-development",
  Website: "website-design-development",
  Strategy: "website-design-development",
};

export function serviceForPost(post: BlogPost): ServiceSlug {
  for (const tag of post.tags) {
    const service = TAG_TO_SERVICE[tag];
    if (service) return service;
  }
  return "website-design-development";
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
    .filter((post) => serviceForPost(post) === service)
    .slice(0, limit);
}
