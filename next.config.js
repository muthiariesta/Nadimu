/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "gznqpobpnixktcpykoez.supabase.co",  // ← tambah ini
      },
    ],
  },
};

module.exports = nextConfig;