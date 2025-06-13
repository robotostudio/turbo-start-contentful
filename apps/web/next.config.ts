import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@workspace/ui"],
  experimental: {
    reactCompiler: true,
    // ppr: true,
    inlineCss: true,
  },
  logging: {
    fetches: {
      hmrRefreshes: true,
    },
  },
  images: {
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors 'self' https://app.contentful.com`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
