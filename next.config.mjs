/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['pg'],
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.skriptkin.ru",
      },
    ],
  },
};

export default nextConfig;
