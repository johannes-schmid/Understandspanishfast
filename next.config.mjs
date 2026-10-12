const REMOVED_APP_ROUTES = [
  '/practice', '/get-started', '/login', '/dashboard/:path*', '/packs/:path*',
  '/seed', '/profile', '/reading', '/articles/:path*', '/unsubscribe', '/auth/:path*',
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: { formats: ['image/avif', 'image/webp'] },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.mostcommonspanish.com' }],
        destination: 'https://mostcommonspanish.com/:path*',
        permanent: true,
      },
      ...REMOVED_APP_ROUTES.map((source) => ({ source, destination: '/study', permanent: true })),
    ]
  },
  async headers() {
    return [
      {
        source: '/.well-known/apple-app-site-association',
        headers: [{ key: 'Content-Type', value: 'application/json' }],
      },
      {
        source: '/:dir(audio|word-images|blog|article-images)/:file*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
}
export default nextConfig
