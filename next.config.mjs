/** @type {import('next').NextConfig} */
const nextConfig = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Increase limit to 10 MB
    },
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
