var webpack = require('webpack');

module.exports = function(config){
  config.set({
    browsers: ['Chrome'],
    singleRune: true,
    frameworks: ['mocha'],
    files: [
      'tests.webpack.js'
    ],
    preprocessors: {
      'tests.webpack.js': ['webpack', 'sourcemap']
    },
    reporters: ['dots'],
    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
	  { test: /\.js$/, loader: 'babel-loader' },
   	  { test: /\.less$/, loader: "style!css!less" }, 
          { test: /\.(woff|woff2)$/, loader: "url?limit=10000&minetype=application/font-woff" },
	  { test: /\.(png|jpg)$/,loader: 'file-loader' },
          { test: /\.json$/, loaders: ['json'] },
	  { test: /\.ttf$/,loader: "url?limit=10000&mimetype=application/octet-stream" },
	  { test: /\.eot$/,loader: "file" },
	  { test: /\.svg$/,loader: "url?limit=10000&mimetype=image/svg+xml"}
	]
      }
    },

    webpackServer: {
      noInfo: true
    }
  });
};
