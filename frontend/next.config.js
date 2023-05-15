/** @type {import('next').NextConfig} */
const localBackend = true;
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  env:{
    backend_url: localBackend? 'http://127.0.0.1:8000' : 'https://our-online-backend.com'
  }
};

module.exports = nextConfig;
