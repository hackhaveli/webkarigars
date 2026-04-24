/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  // Rewrite /any-slug → / so the homepage loads with window.location.pathname intact.
  // Next.js applies rewrites AFTER checking the file-system, so real routes like
  // /api/* are never affected. Only "unknown" paths hit this rule.
  async rewrites() {
    return [
      {
        source: '/:slug',
        destination: '/',
      },
    ];
  },
}

export default nextConfig
