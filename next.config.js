/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.cosmicjs.com', 'imgix.cosmicjs.com'],
  },
  experimental: {
    optimizePackageImports: ['framer-motion']
  }
}

module.exports = nextConfig