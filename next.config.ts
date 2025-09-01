import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: process.env.NEXT_PUBLIC_API_URL
                    ? `${process.env.NEXT_PUBLIC_API_URL}/:path*`
                    : 'http://api:4000/:path*',
            },
        ];
    },
};

export default nextConfig;
