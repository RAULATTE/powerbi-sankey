
const path = require('path');
const webpack = require('webpack');
const PowerBIVizWebpackPlugin = require('powerbi-visuals-webpack-plugin');

module.exports = {
  entry: './src/visual.ts',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'visual.js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new PowerBIVizWebpackPlugin({
      apiVersion: '5.2.0',
      capabilities: path.join(__dirname, 'capabilities.json'),
      pbiviz: path.join(__dirname, 'pbiviz.json'),
      stringResources: []
    })
  ]
};
