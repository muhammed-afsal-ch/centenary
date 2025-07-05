/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ Disable type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    domains: [
      'whitesmoke-panther-163774.hostingersite.com',
      'centuryapp.samastha.info',
    ],
  },

  async rewrites() {
    return [
      {
        source: '/api/external/:path*',
        destination: 'https://samastha100.skssf.in:3001/:path*',
      },
    ];
  },
};

export default nextConfig;
