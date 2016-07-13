var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var getBabel = require('./getBabel');
var getTs = require('./getTs');

var babelLoader = require.resolve('babel-loader');
var cssLoader = require.resolve('css-loader');
var styleLoader = require.resolve('style-loader');
var lessLoader = require.resolve('less-loader');
var tsLoader = require.resolve('ts-loader');

module.exports = {
  resolve: {
    root: process.cwd(),
    extensions: [
      '',
      '.ts',
      '.tsx',
      '.web.ts',
      '.web.tsx',
      '.web.js',
      '.js',
      '.jsx'
    ]
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: ExtractTextPlugin.extract(
        styleLoader, cssLoader + '?sourceMap&-minimize!'
      )
    }, {
      test: /\.less$/,
      loader: ExtractTextPlugin.extract(
        styleLoader, cssLoader + '?sourceMap&-minimize!' + lessLoader + '?sourceMap'
      )
    }, {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: babelLoader
    }, {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      loaders: [babelLoader, tsLoader]
    }]
  },
  plugins: [
    new ExtractTextPlugin('common.css'),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  babel: getBabel(),
  ts: getTs()
};
