/** @type {import('next').NextConfig} */
const nextConfig = {
  // Webpack configuration for Cesium
  webpack: (config, { isServer }) => {
    // Don't bundle Cesium on server side
    if (isServer) {
      config.externals.push('cesium');
    }

    // Handle Cesium's AMD modules
    config.module = config.module || {};
    config.module.unknownContextCritical = false;
    config.module.unknownContextRegExp = /\/cesium\/cesium\/Source\/Core\/buildModuleUrl\.js/;

    // Copy Cesium assets to public directory (handled by build script)
    // Alternative: Use CopyWebpackPlugin if needed

    return config;
  },

  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Environment variables validation
  env: {
    NEXT_PUBLIC_CESIUM_ION_TOKEN: process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN,
  },
};

export default nextConfig;
