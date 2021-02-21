const WorkerPlugin = require('worker-plugin');

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new WorkerPlugin({
          globalObject: 'self'
        })
      );
    }
    return config;
  }
};
