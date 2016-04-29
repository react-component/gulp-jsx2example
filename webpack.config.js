var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  module: {
    loaders: [{
      test: /\.less$/,
      loader: ExtractTextPlugin.extract(
        'css?sourceMap&-minimize' + '!less?sourceMap'
      )
    }, {
      test: /\.jsx$/,
      loader: "babel"
    }]
  },
  plugins: [
    new ExtractTextPlugin('common.css'),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]
};
