const path = require('path');
const slsw = require('serverless-webpack');

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  stats: 'minimal',
  mode: 'none',
  externals: [{ 'aws-sdk': 'commonjs aws-sdk' }],
  resolve: {
    alias: {
      pg: path.resolve(__dirname, './libs/empty/empty_modules'),
      sqlite3: path.resolve(__dirname, './libs/empty/empty_modules'),
      "pg-hstore": path.resolve(__dirname, './libs/empty/empty_modules'),
      tedious: path.resolve(__dirname, './libs/empty/empty_modules'),
    },
  },
  module: {},
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, '.webpack'),
    filename: '[name].js',
  }
};