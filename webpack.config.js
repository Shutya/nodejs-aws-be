const path = require('path');
const { IgnorePlugin } = require('webpack');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  devtool: slsw.lib.webpack.isLocal ? 'cheap-module-eval-source-map' : 'source-map',
  resolve: {
    extensions: ['.json', '.ts', '.js'],
    symlinks: false,
    cacheWithContext: false,
    alias: {
      lib: path.resolve(__dirname, 'lib'),
    }
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.(tsx?)$/,
        loader: 'ts-loader',
        exclude: [
          [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, '.serverless'),
            path.resolve(__dirname, '.webpack'),
          ],
        ],
        options: {
          transpileOnly: true,
          experimentalWatchApi: true,
          configFile: path.resolve(__dirname, 'tsconfig.json'),
        },
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    }),
    new IgnorePlugin(/^pg-native$/)
  ],
};
