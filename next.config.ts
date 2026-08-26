import type { NextConfig } from "next";

const isSitesStaticBuild = process.env.SITES_STATIC_EXPORT === "1";
const workerProxyUrl = process.env.WORKER_DEV_PROXY_URL;

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: isSitesStaticBuild ? "export" : undefined,
  images: isSitesStaticBuild ? { unoptimized: true } : undefined,
  ...(!isSitesStaticBuild && workerProxyUrl
    ? {
        async rewrites() {
          return [{ source: "/api/:path*", destination: `${workerProxyUrl}/api/:path*` }];
        },
      }
    : {}),
};

export default nextConfig;
