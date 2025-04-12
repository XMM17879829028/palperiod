/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['vercel.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
      {
        source: '/sex-calculator',
        destination: '/sex-calculator/page',
      },
      {
        source: '/pregnancy-calculator',
        destination: '/pregnancy-calculator/page',
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'palperiod.com',
          },
        ],
        destination: 'https://www.palperiod.com/:path*',
        permanent: true,
      }
    ]
  },
};

module.exports = nextConfig;
