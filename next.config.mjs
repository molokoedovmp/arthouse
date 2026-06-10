/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['pg'],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.art-territory.ru",
      },
    ],
  },
};

export default nextConfig;
