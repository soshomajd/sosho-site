import type { NextConfig } from "next";

const isSitesStaticBuild = process.env.SITES_STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: isSitesStaticBuild ? "export" : undefined,
  images: isSitesStaticBuild ? { unoptimized: true } : undefined,
};

export default nextConfig;
