
const path = require('path');
const webpack = require('webpack');
const PowerBIVizWebpackPlugin = require('powerbi-visuals-webpack-plugin');
const pbiviz = require('./pbiviz.json');
const capabilities = require('./capabilities.json');

module.exports = {
  entry: './src/visual.ts',
  output: {
    path: path.join(__dirname, '.tmp', 'drop'),
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
    new PowerBIVizWebpackPlugin.PowerBICustomVisualsWebpackPlugin({
      ...pbiviz,
      capabilities,
      apiVersion: pbiviz.apiVersion,
      stringResources: [],
      devMode: false,
      packageOutPath: path.join(__dirname, 'dist'),
      dropPath: path.join(__dirname, '.tmp', 'drop'),
      pluginLocation: path.join('.tmp', 'precompile', 'visualPlugin.ts'),
      capabilitiesSchema: {}
    })
  ]
};
