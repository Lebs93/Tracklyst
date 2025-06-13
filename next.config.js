// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // disables service worker in dev
});

module.exports = withPWA({
  // You can add other Next.js config here if needed
});
