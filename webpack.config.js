var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var getBabel = require('./lib/getBabel');


var babelLoader = require.resolve('babel-loader');
var cssLoader = require.resolve('css-loader');
var lessLoader = require.resolve('less-loader');

module.exports = {
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: ExtractTextPlugin.extract(
        cssLoader + '?sourceMap&-minimize!'
      )
    }, {
      test: /\.less$/,
      loader: ExtractTextPlugin.extract(
        cssLoader + '?sourceMap&-minimize!' + lessLoader + '?sourceMap'
      )
    }, {
      test: /\.jsx?$/,
      loader: babelLoader
    }]
  },
  plugins: [
    new ExtractTextPlugin('common.css'),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  babel: getBabel()
};
