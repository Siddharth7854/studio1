
import type {NextConfig} from 'next';

// Informational Note on "params are being enumerated" error:
// This Next.js App Router error typically means that URL parameters (searchParams
// or dynamic route params) are being accessed or iterated (e.g., Object.keys(),
// JSON.stringify()) in a Server Component without using React.use() or direct
// property access (e.g., searchParams.someKey).
//
// To debug:
// 1. Check any Server Components that receive `params` or `searchParams` as props.
// 2. Ensure you're not directly iterating over these objects.
// 3. Access specific properties (e.g., `searchParams.query`) or use
//    `const clientSearchParams = React.use(searchParams);` for the URLSearchParams API.
// 4. If using an experimental Next.js version (e.g., 15.x.x), it might be a framework bug
//    or a new, stricter check.

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
