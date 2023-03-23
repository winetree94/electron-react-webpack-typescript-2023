const path = require('path');
const ThreadsPlugin = require('threads-plugin');
const ExternalsPlugin = require('webpack2-externals-plugin');

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: ['./src/main/app.ts'],
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    alias: require('./webpack.aliases'),
  },
  stats: 'minimal',
  target: 'electron-main',
  plugins: [
    // new ExternalsPlugin({
    //   type: 'commonjs',
    //   include: path.join(__dirname, 'node_modules'),
    // }),
    new ThreadsPlugin({
      target: 'electron-node-worker',
      // plugins: ['ExternalsPlugin'],
    }),
  ],
};
