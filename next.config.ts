import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Mirror the metadata robots directive so crawlers that skip HTML
          // still see it; frame/typing guards complement the in-page
          // copy/save protections.
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet, noimageindex" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      // Tailwind's transform is scoped to the app's own stylesheet only.
      // The captured Nordstrom stylesheets under src/lib/nordstrom/styles are
      // intentionally excluded — Tailwind's parser reflows minified CSS and
      // corrupts syntax the original page depends on.
      "*.css": {
        condition: {
          all: [{ not: "foreign" }, { path: /^src\/app\/globals\.css$/ }],
        },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
