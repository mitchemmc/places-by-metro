// webpack.config.js
var webpack = require('webpack');
//var D3 = require("d3");
//var TopoJson = require('topoJson');

module.exports = {
  entry: ['./src/entry.js'],
  output: {
    path: './build',
    filename: 'bundle.js'       
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader' },
      { test: /\.html$/, loader: 'file'},
      { test: /\.css$/, loader: 'style-loader!css-loader' }
    ]
  }
};