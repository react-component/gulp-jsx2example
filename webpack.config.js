var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var getBabel = require('./lib/getBabel');

module.exports = {
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.less$/,
      loader: ExtractTextPlugin.extract(
        'css?sourceMap&-minimize' + '!less?sourceMap'
      )
    }, {
      test: /\.jsx?$/,
      loader: 'babel'
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
