import { imageHosts } from './image-hosts.config.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  distDir: process.env.DIST_DIR || '.next',

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: imageHosts,
    minimumCacheTTL: 60,
  },

  // Rewrite /any-slug → / so the homepage loads with window.location.pathname intact.
  // Next.js applies rewrites AFTER checking the file-system, so /collection, /admin,
  // and /api/* resolve normally — only truly unknown slugs hit this rule.
  async rewrites() {
    return [
      {
        // Exclude known top-level routes; everything else is a brand slug
        source: '/:slug((?!collection|admin|api|_next|favicon\\.ico).*)',
        destination: '/',
      },
    ];
  },
};
export default nextConfig;