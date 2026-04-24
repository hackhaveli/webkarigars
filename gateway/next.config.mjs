/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/ecommerce/elane/:path*',
        destination: 'https://elane-template.vercel.app/:path*', // Replace with your actual deployment URL
      },
      {
        source: '/saloon/fa/:path*',
        destination: 'https://fa-template.vercel.app/:path*', // Replace with your actual deployment URL
      },
    ];
  },
};

export default nextConfig;
