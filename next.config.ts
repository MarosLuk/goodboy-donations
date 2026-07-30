import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Compile-time transform for styled-components: class names stay stable between
  // the server and client render, and components get readable display names.
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
