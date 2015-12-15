var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: './dist/'
  },
  module: {
    loaders: [
      {
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'src')
    },
    {test: /\.less$/, loader: "style!css!less"},
    {test: /\.(woff|woff2)$/, loader: "url?limit=10000&minetype=application/font-woff"},
    {test: /\.(png|jpg)$/,loader: 'file-loader'},
    {test: /\.json$/, loaders: ['json']},
    {test: /\.ttf$/,loader: "url?limit=10000&mimetype=application/octet-stream"},
    {test: /\.eot$/,loader: "file"},
    {test: /\.svg$/,loader: "url?limit=10000&mimetype=image/svg+xml"}
    ]
  },
  resolve: {
    root: path.join(__dirname, '')
  }
};
