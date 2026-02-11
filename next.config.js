/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ug-sot-internship-cu.vercel.app',
      },
    ],
  },
};

module.exports = nextConfig;
