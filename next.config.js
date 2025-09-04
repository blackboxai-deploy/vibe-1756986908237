```js
/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})

const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'], // Allow local images for demo
  },
  // Enable PWA for mobile app feel
}

module.exports = withPWA(nextConfig)
```