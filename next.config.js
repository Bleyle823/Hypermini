/** @type {import("next").NextConfig} */
const config = {
  webpack: (config, { isServer }) => {
    // Only apply Node.js fallbacks for client-side builds
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        assert: false,
        http: false,
        https: false,
        os: false,
        url: false,
        zlib: false,
        util: false,
        buffer: false,
        events: false,
      };
    }
    
    return config;
  },
};

export default config;
