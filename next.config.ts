import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // Required for the multi-stage Dockerfile (copies `.next/standalone`).
  output: 'standalone',
  // Added/Modified by Rajarshi for TBD — START
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  // Added/Modified by Rajarshi for TBD — END
};

// Added/Modified by Rajarshi for TBD — START
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
// Added/Modified by Rajarshi for TBD — END

export default withNextIntl(nextConfig);
