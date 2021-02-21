const WorkerPlugin = require('worker-plugin');

module.exports = () => {
  return {
    target: 'serverless',
    webpack: (config, { isServer }) => {
      config.resolve.mainFields = ['main', 'browser', 'module'];
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
