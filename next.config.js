/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure trailing slashes are handled correctly
  trailingSlash: false,
  // Ensure the base path is set correctly
  basePath: '',
  // Add CORS headers for direct API calls
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
  // Add rewrites for API calls
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: `${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/:path*`,
      },
    ];
  },
};

module.exports = nextConfig; 