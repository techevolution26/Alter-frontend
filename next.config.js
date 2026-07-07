/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      // Generous but bounded — STK push payloads and forms are small;
      // this just guards against abuse, not a real payload need.
      bodySizeLimit: "1mb",
    },
  },
};

module.exports = nextConfig;
