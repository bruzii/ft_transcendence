/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['img-front-event.s3.eu-west-3.amazonaws.com']
  }
};
module.exports = nextConfig;
