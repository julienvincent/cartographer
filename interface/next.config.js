const WorkerPlugin = require('worker-plugin');

module.exports = (phase, { defaultConfig }) => {
  return {
    ...defaultConfig,
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
};
