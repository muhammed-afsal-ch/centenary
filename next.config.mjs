/** @type {import('next').NextConfig} */
const nextConfig = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },

  images: {
    domains: ['whitesmoke-panther-163774.hostingersite.com', 'centuryapp.samastha.info'],
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
